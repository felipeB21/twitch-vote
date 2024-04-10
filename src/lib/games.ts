const clientId: string = import.meta.env.TWITCH_CLIENT_ID;
const clientSecret: string = import.meta.env.TWITCH_CLIENT_SECRET;

let accessToken: string | undefined;

export const getAcces = async (): Promise<void> => {
  const token = await fetch(
    `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
    {
      method: "POST",
    }
  );

  const res = await token.json();
  accessToken = res.access_token;
};

interface Game {
  id: string;
  name: string;
  box_art_url: string;
  igdb_id: string;
}

export const getGames = async (): Promise<Game[]> => {
  if (!accessToken) {
    await getAcces();
  }

  const response = await fetch("https://api.twitch.tv/helix/games/top", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Client-Id": import.meta.env.TWITCH_CLIENT_ID,
    },
  });

  const data = await response.json();
  return data.data;
};
