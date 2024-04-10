import { column, defineDb } from "astro:db";

const Votes = {
  columns: {
    id: column.text({ primaryKey: true }),
    gameId: column.text(),
    userId: column.text(),
    voteId: column.text(),
    votedAt: column.date(),
  },
};

export default defineDb({
  tables: {
    Votes,
  },
});
