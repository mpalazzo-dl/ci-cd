"use client";

import { useEffect, useState } from "react";
import { useContentfulLiveUpdates } from "@contentful/live-preview/react";

import type { CfFetchById } from "@aces/types";

import { CfTeamListing } from "./render";
import { fetchTeamListingData } from "./services";
import { TeamListingSkeleton } from "./skeleton";

export interface CfTeamListingClientProps extends CfFetchById {}

export const CfTeamListingClient = ({
  id,
  preview,
  lang,
}: CfTeamListingClientProps) => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchTeamListingData(id, preview, lang)
      .then(setData)
      .catch((err) => {
        console.error("Client fetch failed:", err);
      });
  }, [id, preview, lang]);

  const updatedData = useContentfulLiveUpdates(data);

  if (!updatedData) return <TeamListingSkeleton />;

  return (
    <CfTeamListing
      internalTitle={updatedData.internalTitle}
      headline={updatedData.headline}
      teamMembersCollection={updatedData.teamMembersCollection}
      __typename={updatedData.__typename}
      id={id}
      lang={lang}
      preview={preview}
    />
  );
};
