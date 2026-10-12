"use client";

import { useEffect, useState } from "react";
import { useContentfulLiveUpdates } from "@contentful/live-preview/react";

import type { CfFetchById } from "@aces/types";

import { CfForm } from "./render";
import { fetchFormData } from "./services";
import { CfFormSkeleton } from "./skeleton";

export interface CfFormClientProps extends CfFetchById {}

export const CfFormClient = ({ id, preview, lang }: CfFormClientProps) => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchFormData(id, preview, lang)
      .then(setData)
      .catch((err) => {
        console.error("Client fetch failed:", err);
      });
  }, [id, preview, lang]);

  const updatedData = useContentfulLiveUpdates(data);

  if (!updatedData) return <CfFormSkeleton />;

  return (
    <CfForm
      internalTitle={updatedData.internalTitle}
      form={updatedData.form}
      headline={updatedData.headline}
      subhead={updatedData.subhead}
      media={updatedData.media}
      __typename={updatedData.__typename}
      id={id}
      lang={lang}
      preview={preview}
    />
  );
};
