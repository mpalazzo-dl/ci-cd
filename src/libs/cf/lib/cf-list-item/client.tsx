"use client";

import { useEffect, useState } from "react";
import { useContentfulLiveUpdates } from "@contentful/live-preview/react";

import type { CfFetchById } from "@aces/types";

import { CfListItem } from "./render";
import { fetchListItemData } from "./services";
import { ListItemSkeleton } from "./skeleton";

export interface CfListItemClientProps extends CfFetchById {}

export const CfListItemClient = ({
  id,
  preview,
  lang,
}: CfListItemClientProps) => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchListItemData(id, preview, lang)
      .then(setData)
      .catch((err) => {
        console.error("Client fetch failed:", err);
      });
  }, [id, preview, lang]);

  const updatedData = useContentfulLiveUpdates(data);

  if (!updatedData) return <ListItemSkeleton />;

  return (
    <CfListItem
      internalTitle={updatedData.internalTitle}
      headline={updatedData.headline}
      bodyCopy={updatedData.bodyCopy}
      listCopy={updatedData.listCopy}
      columns={updatedData.columns}
      media={updatedData.media}
      __typename={updatedData.__typename}
      id={id}
      lang={lang}
      preview={preview}
    />
  );
};
