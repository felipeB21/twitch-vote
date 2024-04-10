import { createHash } from "node:crypto";
import { NOW, Votes, db } from "astro:db";
import type { APIRoute } from "astro";
import { object, string, safeParse } from "valibot";
import { getSession } from "auth-astro/server";

import { getGames } from "../../../lib/games";

const VoteSchema = object({
  voteId: string(),
});

const generateId = (str: string) => {
  return createHash("sha256").update(str).digest("hex");
};

const res = (
  body: string,
  {
    status,
    statusText,
    headers,
  }: { status?: number; statusText?: string; headers?: Headers }
) => new Response(body, { status, statusText, headers });

export const POST: APIRoute = async ({ params, request }) => {
  const session = await getSession(request);
  if (!session || session?.user?.email == null)
    return new Response("Unauthorized", { status: 401 });

  const { gameId } = params;
  if (!gameId) return res("Missing game ID", { status: 400 });

  const gameData = await getGames();
  if (!gameData) {
    return res("Game not found", { status: 404 });
  }

  const { success, output } = safeParse(VoteSchema, await request.json());
  if (!success) return res("Bad request", { status: 400 });

  const { voteId } = output;

  const userId = generateId(session?.user?.email);
  const votedAt = NOW;

  const newId = `${gameId}-${userId}`;
  const vote = {
    id: newId,
    userId,
    votedAt,
    voteId,
    gameId,
  };

  try {
    await db.insert(Votes).values(vote);
  } catch (error) {
    console.log(error);
  }

  return new Response("Hello World", { status: 200 });
};
