"use client";

import { useEffect, useState } from "react";
import { useContentfulLiveUpdates } from "@contentful/live-preview/react";

import type { CfFetchById } from "@aces/types";

import { CfTestimonials } from "./render";
import { fetchTestimonialsData } from "./services";
import { TestimonialsSkeleton } from "./skeleton";

export interface CfTestimonialsClientProps extends CfFetchById {}

export const CfTestimonialsClient = ({
  id,
  preview,
  lang,
}: CfTestimonialsClientProps) => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchTestimonialsData(id, preview, lang)
      .then(setData)
      .catch((err) => {
        console.error("Client fetch failed:", err);
      });
  }, [id, preview, lang]);

  const updatedData = useContentfulLiveUpdates(data);

  if (!updatedData) return <TestimonialsSkeleton />;

  return (
    <CfTestimonials
      internalTitle={updatedData.internalTitle}
      headline={updatedData.headline}
      testimonials={updatedData.testimonialsCollection?.items}
      __typename={updatedData.__typename}
      id={id}
      lang={lang}
      preview={preview}
    />
  );
};
