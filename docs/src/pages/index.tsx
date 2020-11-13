import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import clsx from "clsx";
import React from "react";
import styles from "./styles.module.css";

const features_first_row = [
  {
    title: "Small bundle size",
    imageUrl: "img/smaller_bundle.svg",
    description: (
      <>
        Tinka is a dependency free client, everything is a middleware
          (yes, literally everything, even the actual fetch which happens is a middleware),
          you can use what you want, even if you end up wanting everything, it's only <b>1.7Kb</b>
      </>
    )
  },
  {
    title: "Written in TypeScript",
    imageUrl: "img/typescript.svg",
    description: (
      <>
        Npm package ships with type definitions, making it easier for you to write your own SDK client,
          middleware or simply consuming an API
      </>
    )
  },
  {
    title: "Maximize productivity",
    imageUrl: "img/dev_productivity.svg",
    description: (
      <>
        A developers job should be building things, not figuring which key is missing in a POST request, generate SDKs for your API,
          let type definition and SDK make developers life easier, focusing on what's more important.
      </>
    )
  }
];

const features_second_row = [
    {
        title: "Middleware support",
        imageUrl: "img/easy.svg",
        offset: 3,
        description: (
            <>
                Middlewares are primary entities for tinka, everything is built on top of middlewares,
                it comes with a few middlewares included, and it's very easy to write a new middleware.
            </>
        )
    },
    {
        title: "Very close to actual fetch",
        imageUrl: "img/spec.svg",
        description: (
            <>
                Every step of the way in designing `tinka`, aligning everything to fetch spec was kept in mind, think of `tinka` as fetch on steroids.
            </>
        )
    }
];
function Feature({imageUrl, title, description, offset = null}) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={clsx("col col--4", styles.feature, offset ? `col--offset-${offset}` : undefined)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  return (
    <Layout
      title={"Make calling API easier"}
      description="Description will go into a meta tag in <head />">
      <header className={clsx("hero hero--primary", styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={clsx(
                "button button--secondary button--outline button--lg",
                styles.getStarted
              )}
              to={useBaseUrl("docs/")}>
              Get Started
            </Link>
          </div>
        </div>
      </header>
      <main>
        {features_first_row && features_first_row.length > 0 && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features_first_row.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
              <div className="row">
                {features_second_row.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
