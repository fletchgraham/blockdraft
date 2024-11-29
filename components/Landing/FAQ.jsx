"use client";

import { Collapse } from "react-daisyui";

export const FAQ = () => {
  return (
    <section className="py-8 lg:py-20" id="faq">
      <div className="container">
        <div className="text-center">
          <h2 className="text-4xl font-semibold text-base-content">FAQs</h2>
          <p className="mt-2 text-lg">
            Got questions? We’ve got answers. Learn more about BlockDraft and
            how it can enhance your newsletter workflow.
          </p>
        </div>

        <div className="mt-12 flex justify-center gap-6">
          <div className="space-y-4 lg:w-1/2">
            <Collapse className="border border-base-content/10" icon="arrow">
              <Collapse.Title className="text-xl font-medium">
                What is BlockDraft?
              </Collapse.Title>
              <Collapse.Content>
                <p className="text-base">
                  BlockDraft is a drag-and-drop editor that simplifies
                  newsletter creation by providing AI-powered content summaries
                  and an intuitive workflow for organizing your articles.
                </p>
              </Collapse.Content>
            </Collapse>

            <Collapse className="border border-base-content/10" icon="arrow">
              <Collapse.Title className="text-xl font-medium">
                Who is BlockDraft for?
              </Collapse.Title>
              <Collapse.Content>
                <p className="text-base">
                  BlockDraft is designed for newsletter creators, especially
                  those curating content from multiple sources. Whether you're a
                  solo creator or managing multiple publications, BlockDraft
                  streamlines your workflow.
                </p>
              </Collapse.Content>
            </Collapse>

            <Collapse className="border border-base-content/10" icon="arrow">
              <Collapse.Title className="text-xl font-medium">
                How does the free trial work?
              </Collapse.Title>
              <Collapse.Content>
                <p className="text-base">
                  The free trial gives you all the features of the Pro plan, but
                  limits you to 100 AI summaries as a trial period. This should
                  last you about a month if you're publishing twice a week.
                </p>
              </Collapse.Content>
            </Collapse>

            <Collapse className="border border-base-content/10" icon="arrow">
              <Collapse.Title className="text-xl font-medium">
                Can I use BlockDraft with platforms like Substack or Beehiiv?
              </Collapse.Title>
              <Collapse.Content>
                <p className="text-base">
                  Absolutely! BlockDraft copies rich text to your clipboard,
                  making it easy to paste directly into platforms like Substack,
                  Beehiiv, and any editor that supports rich text.
                </p>
              </Collapse.Content>
            </Collapse>

            <Collapse className="border border-base-content/10" icon="arrow">
              <Collapse.Title className="text-xl font-medium">
                How are AI summaries generated?
              </Collapse.Title>
              <Collapse.Content>
                <p className="text-base">
                  BlockDraft uses advanced AI to analyze your imported URLs and
                  generate concise, engaging summaries. You can edit these
                  summaries to fit your voice and style.
                </p>
              </Collapse.Content>
            </Collapse>

            <Collapse className="border border-base-content/10" icon="arrow">
              <Collapse.Title className="text-xl font-medium">
                What happens if I exceed my plan’s AI summary limit?
              </Collapse.Title>
              <Collapse.Content>
                <p className="text-base">
                  You’ll have the option to upgrade your plan or purchase
                  additional summaries as an add-on. We’ll notify you when
                  you’re approaching your limit.
                </p>
              </Collapse.Content>
            </Collapse>

            <Collapse className="border border-base-content/10" icon="arrow">
              <Collapse.Title className="text-xl font-medium">
                Can I cancel or change my plan?
              </Collapse.Title>
              <Collapse.Content>
                <p className="text-base">
                  Yes, you can cancel or upgrade your plan anytime from your
                  account settings. Changes take effect immediately, and you’ll
                  only be billed for the time used.
                </p>
              </Collapse.Content>
            </Collapse>
          </div>
        </div>
      </div>
    </section>
  );
};
