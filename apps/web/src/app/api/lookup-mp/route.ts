import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const postalCode = request.nextUrl.searchParams.get('postalCode');

  if (!postalCode || !/^[A-Z]\d[A-Z]\d[A-Z]\d$/.test(postalCode)) {
    return NextResponse.json(
      { error: 'Invalid postal code format.' },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(
      `https://represent.opennorth.ca/postcodes/${postalCode}/?format=json`,
      { next: { revalidate: 86400 } } // Cache for 24 hours
    );

    if (!res.ok) {
      if (res.status === 404) {
        return NextResponse.json(
          { error: 'Postal code not found. Please check and try again.' },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: 'Could not look up this postal code. Please try again later.' },
        { status: 502 }
      );
    }

    const data = await res.json();
    const reps = data.representatives_centroid || data.representatives || [];

    // Find the House of Commons MP
    const mp = reps.find(
      (r: any) =>
        r.elected_office === 'MP' ||
        r.representative_set_name === 'House of Commons'
    );

    // Find senators from the same province
    const senators = reps.filter(
      (r: any) =>
        r.elected_office === 'Senator' ||
        r.representative_set_name === 'Senate'
    );

    return NextResponse.json({
      mp: mp
        ? {
            name: mp.name,
            party_name: mp.party_name,
            district_name: mp.district_name,
            province: mp.province,
            photo_url: mp.photo_url,
            url: mp.url,
            personal_url: mp.personal_url,
            email: mp.email,
            elected_office: mp.elected_office,
          }
        : null,
      senators: senators.map((s: any) => ({
        name: s.name,
        party_name: s.party_name,
        district_name: s.district_name,
        province: s.province,
        photo_url: s.photo_url,
        url: s.url,
        personal_url: s.personal_url,
        email: s.email,
        elected_office: s.elected_office,
      })),
      error: null,
    });
  } catch {
    return NextResponse.json(
      { error: 'Could not connect to the representative lookup service.' },
      { status: 502 }
    );
  }
}
