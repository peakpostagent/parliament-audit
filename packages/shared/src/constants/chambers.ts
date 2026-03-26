/**
 * Chamber and session constants.
 */

export const CHAMBERS = {
  house: {
    name: 'House of Commons',
    nameFr: 'Chambre des communes',
    badge: 'HOUSE VOTE' as const,
  },
  senate: {
    name: 'Senate',
    nameFr: 'Sénat',
    badge: 'SENATE VOTE' as const,
  },
} as const;

/**
 * URLs for official parliamentary sources.
 */
export const PARLIAMENT_URLS = {
  houseVotesXml: (parlSession: string) =>
    `https://www.ourcommons.ca/Members/en/Votes/XML?parlSession=${parlSession}&output=XML`,

  houseMemberVotesXml: (personId: string) =>
    `https://www.ourcommons.ca/Parliamentarians/en/members/${personId}/ExportVotes?output=XML`,

  houseVotePage: (parliament: number, session: number, voteNumber: number) =>
    `https://www.ourcommons.ca/Members/en/votes/${parliament}/${session}/${voteNumber}`,

  houseMembersXml: () =>
    `https://www.ourcommons.ca/Members/en/search/XML`,

  housePartyStandingsXml: () =>
    `https://www.ourcommons.ca/Members/en/party-standings/XML`,

  senateVotes: (parlSession?: string) =>
    parlSession
      ? `https://sencanada.ca/en/in-the-chamber/votes/${parlSession}`
      : `https://sencanada.ca/en/in-the-chamber/votes/`,

  legisinfoBillsJson: (parlSession?: string) =>
    parlSession
      ? `https://www.parl.ca/legisinfo/en/bills/json?parlsession=${parlSession}`
      : `https://www.parl.ca/legisinfo/en/bills/json`,

  legisinfoBillPage: (parlSession: string, billNumber: string) =>
    `https://www.parl.ca/legisinfo/en/bill/${parlSession}/${billNumber.toLowerCase()}`,

  hansard: (parliament: number, session: number, sittingNumber: number) =>
    `https://www.ourcommons.ca/DocumentViewer/en/${parliament}-${session}/house/sitting-${sittingNumber}/hansard`,
} as const;
