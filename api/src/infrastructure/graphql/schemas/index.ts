import { buildSchema as buildSchemaTypeGraphQL } from "type-graphql";
import { Container } from "typedi";

import { CityResolver } from "@/infrastructure/graphql/resolvers/CityResolver";
import { ActivityRankingResolver } from "@/infrastructure/graphql/resolvers/ActivityRankingResolver";

export const buildSchema = async () => {
  // Build TypeGraphQL schema
  const schema = await buildSchemaTypeGraphQL({
    resolvers: [
      CityResolver,
      ActivityRankingResolver,
    ],
    emitSchemaFile: true,
    validate: false,
    container: Container,
  });

  return schema;
};