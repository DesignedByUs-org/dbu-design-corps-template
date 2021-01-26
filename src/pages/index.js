import React, { useState, useEffect, useRef } from "react";
import "reset-css";
import { shuffle, sortBy } from "lodash";
import { graphql } from "gatsby";
import classnames from "classnames";
import { DialogOverlay, DialogContent } from "@reach/dialog";
import ClickableBox from "clickable-box";
import categories from "../categories";
import Profile from "../components/profile";
import Layout from "../components/layout";
import FilterItem from "../components/filter-item";
import Nav from "../components/nav";
import Loader from "../components/loader";
import paginate from "../paginate";
import "@reach/dialog/styles.css";
import styles from "./index.module.scss";
import CloseIcon from "../icons/close";
import FilterIcon from "../icons/filter";
import Button from "../components/button";

const capitalize = (s) => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const App = ({ data }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [visibleDesigners, setVisibleDesigners] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});

  const [isFilterListVisible, setIsFilterListVisible] = useState(false);

  const [showDialog, setShowDialog] = React.useState(false);
  const open = () => setShowDialog(true);
  const close = () => setShowDialog(false);

  const [currentPage, setCurrentPage] = useState(1);

  const profileContainerRef = useRef();

  const filterCategoryTypes = [
    { name: "Expertise", id: "expertise" },
    { name: "Position", id: "position" },
    { name: "Programs & productions", id: "location" },
  ];

  function filterItemOnChange(e, section) {
    const categoryId = e.target.value;
    const isChecked = e.target.checked;

    const newSelectedFilters = selectedFilters[section.id] || [];

    if (isChecked) {
      newSelectedFilters.push(categoryId);
    } else {
      const i = newSelectedFilters.indexOf(categoryId);

      newSelectedFilters.splice(i, 1);
    }

    setSelectedFilters({
      ...selectedFilters,
      [section.id]: newSelectedFilters,
    });
    setCurrentPage(1);
  }

  useEffect(() => {
    const shuffledDesigners = shuffle(data.allTwitterProfile.edges);
    setVisibleDesigners(shuffledDesigners);
    setIsLoading(false);
  }, [data.allTwitterProfile.edges]);

  const numDesignersPerPage = 52;
  const numPagesToShowInPagination = 5;

  const isNoFilterApplied = Object.entries(selectedFilters).every(
    (category) => {
      const [, value] = category;
      return value.length === 0;
    }
  );

  const filteredDesigners = isNoFilterApplied
    ? visibleDesigners
    : visibleDesigners.filter((member) => {
        // A profile should appear if they have at least one tag within each
        // section.
        return Object.entries(selectedFilters).every((category) => {
          const [categoryName, categoryValue] = category;

          if (categoryValue.length === 0) {
            return true;
          }

          return categoryValue.some((filter) => {
            return designer.node.profile.tags[categoryName][filter];
          });
        });
      });

  const pagination = paginate(
    filteredDesigners.length,
    currentPage,
    numDesignersPerPage,
    numPagesToShowInPagination
  );

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.sidebar}>
          <Nav
            filter
            theme="dark"
            toggleFilterList={() => {
              setIsFilterListVisible(!isFilterListVisible);
            }}
            isLoading={isLoading}
          />

          <div
            className={classnames({
              [styles.filterContainer]: true,
              [styles.filterListVisible]: isFilterListVisible,
            })}
          >
            {filterCategoryTypes.map((section) => {
              const categoriesInSection = categories.filter(
                (c) => c[section.id]
              );
              const sortedCategoriesInSection = sortBy(
                categoriesInSection,
                (category) => category.title
              );
              return (
                <div key={section.id}>
                  <h3 className={styles.filterCategoryTitle}>{section.name}</h3>
                  {sortedCategoriesInSection.map((category) => (
                    <FilterItem
                      key={category.id}
                      id={category.id}
                      type="row"
                      onChange={(e) => {
                        filterItemOnChange(e, section);
                      }}
                      isChecked={
                        selectedFilters[section.id]?.includes(category.id) ||
                        false
                      }
                      className={styles.filterItemInput}
                      title={category.title}
                      count={
                        data[`tagCount${capitalize(category.id)}`].totalCount
                      }
                    />
                  ))}
                </div>
              );
            })}
          </div>
        </div>
        <div
          className={classnames({
            [styles.main]: true,
            [styles.slide]: isFilterListVisible,
          })}
          ref={profileContainerRef}
        >
          {isLoading ? (
            <Loader />
          ) : (
            <>
              <div className={styles.profiles}>
                {filteredDesigners.map(({ node: designer }, i) => {
                  if (i < pagination.startIndex || i > pagination.endIndex) {
                    return null;
                  }

                  return (
                    <Profile
                      image={designer.profile.profile_image_url_https}

                      fluid={designer.localFile.childImageSharp?.fluid}
                      name={designer.profile.name}
                      description={designer.profile.description}
                      location={designer.profile.location || "N/A"}
                      hex={`#${designer.profile.profile_link_color}`}
                      key={designer.profile.screen_name}
                      contrast={designer.profile.contrast}
                      // displayUrl={
                      //   designer.profile.entities.url?.urls[0].display_url
                      // }
                      // expandedUrl={
                      //   designer.profile.entities.url?.urls[0].expanded_url
                      // }
                      handle={designer.profile.screen_name}
                    />
                  );
                })}
              </div>

              {filteredDesigners.length > 0 ? (
                <>
                  <div className={styles.paginationContainer}>
                    <button
                      onClick={() => {
                        setCurrentPage(currentPage - 1);
                        profileContainerRef.current.scrollTo(0, 0);
                      }}
                      disabled={pagination.currentPage === pagination.startPage}
                      type="button"
                      className={styles.paginationArrow}
                    >
                      ←
                    </button>
                    <button
                      className={styles.pageNumberButton}
                      onClick={() => {
                        setCurrentPage(1);
                        profileContainerRef.current.scrollTo(0, 0);
                      }}
                      type="button"
                      disabled={pagination.currentPage === 1}
                    >
                      1
                    </button>
                    {currentPage >= numPagesToShowInPagination && <>&hellip;</>}
                    {pagination.pages.map((pageNumber) => {
                      // Skip over these page numbers because they'll always appear
                      // in the pagination.
                      if (
                        pageNumber === 1 ||
                        pageNumber === pagination.totalPages
                      ) {
                        return null;
                      }

                      return (
                        <button
                          key={pageNumber}
                          className={styles.pageNumberButton}
                          onClick={() => {
                            setCurrentPage(pageNumber);
                            profileContainerRef.current.scrollTo(0, 0);
                          }}
                          disabled={pagination.currentPage === pageNumber}
                          type="button"
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                    {currentPage <=
                      pagination.totalPages -
                        (numPagesToShowInPagination + 1) && <>&hellip;</>}
                    {pagination.totalPages !== 1 && (
                      <button
                        className={styles.pageNumberButton}
                        onClick={() => {
                          setCurrentPage(pagination.totalPages);
                          profileContainerRef.current.scrollTo(0, 0);
                        }}
                        type="button"
                        disabled={
                          pagination.currentPage === pagination.totalPages
                        }
                      >
                        {pagination.totalPages}
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setCurrentPage(currentPage + 1);
                        profileContainerRef.current.scrollTo(0, 0);
                      }}
                      disabled={pagination.currentPage === pagination.endPage}
                      type="button"
                      className={styles.paginationArrow}
                    >
                      →
                    </button>
                  </div>
                  <div className={styles.filterButtonContainer}>
                    <Button type="button" onClick={open} fullWidth={false}>
                      <FilterIcon /> Filter
                      {selectedFilters.length > 0 && (
                        <>
                          <span>·</span> <span>{selectedFilters.length}</span>
                        </>
                      )}
                    </Button>
                  </div>
                </>
              ) : (
                <div>There are no Design Corps members that match these filters.</div>
              )}
            </>
          )}
          <div>
            <DialogOverlay isOpen={showDialog} onDismiss={close}>
              <DialogContent aria-label="Filter designers">
                <div className={styles.dialogHeader}>
                  <ClickableBox className={styles.closeButton} onClick={close}>
                    <span aria-hidden>
                      <CloseIcon />
                    </span>
                  </ClickableBox>
                  <h2>Filter</h2>
                  <button
                    onClick={() => {
                      setSelectedFilters([]);
                      setCurrentPage(1);
                    }}
                    className={styles.filterClear}
                    type="button"
                    style={{ marginRight: "16px" }}
                  >
                    Clear
                  </button>
                </div>
                <div className={styles.dialogBody}>
                  {filterCategoryTypes.map((section) => {
                    const categoriesInSection = categories.filter(
                      (c) => c[section.id]
                    );
                    const sortedCategoriesInSection = sortBy(
                      categoriesInSection,
                      (category) => category.title
                    );

                    return (
                      <div key={section.id}>
                        <h3 className={styles.filterCategoryTitle}>
                          {section.name}
                        </h3>
                        {sortedCategoriesInSection.map((category) => (
                          <FilterItem
                            key={category.id}
                            id={category.id}
                            type="pill"
                            onChange={(e) => {
                              filterItemOnChange(e, section);
                            }}
                            isChecked={
                              selectedFilters[section.id]?.includes(
                                category.id
                              ) || false
                            }
                            className={styles.filterItemInput}
                            title={category.title}
                          />
                        ))}
                      </div>
                    );
                  })}
                </div>
                <div className={styles.dialogFooter}>
                  <Button type="button" onClick={close}>
                    View {filteredDesigners.length} designer
                    {filteredDesigners.length !== 1 ? "s" : ""}
                  </Button>
                </div>
              </DialogContent>
            </DialogOverlay>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default App;

export const pageQuery = graphql`
  query Index {
    allTwitterProfile {
      edges {
        node {
          localFile {
            childImageSharp {
              fluid(grayscale: true, maxWidth: 200) {
                ...GatsbyImageSharpFluid_withWebp_noBase64
              }
            }
          }
          profile {
            description
            name
            screen_name
            location
            profile_image_url_https
            profile_link_color
            tags {
              location {
                mask
                li
                truthbot
                earthspeaks
                designedby
                breathe
                fivethings
                indisting
                consensual
                democracy
                melange
                kakuma
              }
              position {
                ceo
                inventor
                distinguisheddesigner
                founder
                apprentice
                designfellow
                cdo
                corps
                speaker
                vp
              }
              expertise {
                datascience
                prodmanager
                designtech
                animator
                cognitive
                engineer
                industrial
                technologist
                scientist
                interior
                research
                artist
                fashion
                architect
                writer
                human
                voice
                sound
                gesture
              }
            }
            entities {
              url {
                urls {
                  expanded_url
                  display_url
                }
              }
            }
          }
        }
      }
    }

    tagCountDatascience: allTwitterProfile(
      filter: { profile: { tags: { expertise: { datascience: { eq: true } } } } }
    ) {
      totalCount
    }

    tagCountInventor: allTwitterProfile(
      filter: { profile: { tags: { position: { inventor: { eq: true } } } } }
    ) {
      totalCount
    }

    tagCountCeo: allTwitterProfile(
      filter: { profile: { tags: { position: { ceo: { eq: true } } } } }
    ) {
      totalCount
    }

    tagCountProdmanager: allTwitterProfile(
      filter: { profile: { tags: { expertise: { prodmanager: { eq: true } } } } }
    ) {
      totalCount
    }

    tagCountDesigntech: allTwitterProfile(
      filter: { profile: { tags: { expertise: { designtech: { eq: true } } } } }
    ) {
      totalCount
    }

    tagCountCognitive: allTwitterProfile(
      filter: { profile: { tags: { expertise: { cognitive: { eq: true } } } } }
    ) {
      totalCount
    }

    tagCountDistinguisheddesigner: allTwitterProfile(
      filter: { profile: { tags: { position: { distinguisheddesigner: { eq: true } } } } }
    ) {
      totalCount
    }

    tagCountEngineer: allTwitterProfile(
      filter: { profile: { tags: { expertise: { engineer: { eq: true } } } } }
    ) {
      totalCount
    }

    tagCountFounder: allTwitterProfile(
      filter: { profile: { tags: { position: { founder: { eq: true } } } } }
    ) {
      totalCount
    }

    tagCountApprentice: allTwitterProfile(
      filter: { profile: { tags: { position: { apprentice: { eq: true } } } } }
    ) {
      totalCount
    }

    tagCountIndustrial: allTwitterProfile(
      filter: { profile: { tags: { expertise: { industrial: { eq: true } } } } }
    ) {
      totalCount
    }

    tagCountDesignfellow: allTwitterProfile(
      filter: { profile: { tags: { position: { designfellow: { eq: true } } } } }
    ) {
      totalCount
    }

    tagCountTechnologist: allTwitterProfile(
      filter: {
        profile: { tags: { expertise: { technologist: { eq: true } } } }
      }
    ) {
      totalCount
    }

    tagCountCdo: allTwitterProfile(
      filter: { profile: { tags: { position: { cdo: { eq: true } } } } }
    ) {
      totalCount
    }

    tagCountScientist: allTwitterProfile(
      filter: { profile: { tags: { expertise: { scientist: { eq: true } } } } }
    ) {
      totalCount
    }

    tagCountCorps: allTwitterProfile(
      filter: { profile: { tags: { position: { corps: { eq: true } } } } }
    ) {
      totalCount
    }

    tagCountInterior: allTwitterProfile(
      filter: { profile: { tags: { expertise: { interior: { eq: true } } } } }
    ) {
      totalCount
    }

    tagCountResearch: allTwitterProfile(
      filter: { profile: { tags: { expertise: { research: { eq: true } } } } }
    ) {
      totalCount
    }

    tagCountSpeaker: allTwitterProfile(
      filter: { profile: { tags: { position: { speaker: { eq: true } } } } }
    ) {
      totalCount
    }

    tagCountAnimator: allTwitterProfile(
      filter: { profile: { tags: { expertise: { animator: { eq: true } } } } }
    ) {
      totalCount
    }

    tagCountFashion: allTwitterProfile(
      filter: { profile: { tags: { expertise: { fashion: { eq: true } } } } }
    ) {
      totalCount
    }

    tagCountVp: allTwitterProfile(
      filter: { profile: { tags: { position: { vp: { eq: true } } } } }
    ) {
      totalCount
    }

    tagCountArchitect: allTwitterProfile(
      filter: { profile: { tags: { expertise: { architect: { eq: true } } } } }
    ) {
      totalCount
    }

    tagCountWriter: allTwitterProfile(
      filter: { profile: { tags: { expertise: { writer: { eq: true } } } } }
    ) {
      totalCount
    }

    tagCountHuman: allTwitterProfile(
      filter: { profile: { tags: { expertise: { human: { eq: true } } } } }
    ) {
      totalCount
    }

    tagCountVoice: allTwitterProfile(
      filter: { profile: { tags: { expertise: { voice: { eq: true } } } } }
    ) {
      totalCount
    }

    tagCountSound: allTwitterProfile(
      filter: { profile: { tags: { expertise: { sound: { eq: true } } } } }
    ) {
      totalCount
    }

    tagCountGesture: allTwitterProfile(
      filter: { profile: { tags: { expertise: { gesture: { eq: true } } } } }
    ) {
      totalCount
    }

    tagCountLi: allTwitterProfile(
      filter: { profile: { tags: { location: { li: { eq: true } } } } }
    ) {
      totalCount
    }
    tagCountTruthbot: allTwitterProfile(
      filter: { profile: { tags: { location: { truthbot: { eq: true } } } } }
    ) {
      totalCount
    }
    tagCountMask: allTwitterProfile(
      filter: { profile: { tags: { location: { mask: { eq: true } } } } }
    ) {
      totalCount
    }
    tagCountEarthspeaks: allTwitterProfile(
      filter: { profile: { tags: { location: { earthspeaks: { eq: true } } } } }
    ) {
      totalCount
    }
    tagCountIndisting: allTwitterProfile(
      filter: { profile: { tags: { location: { indisting: { eq: true } } } } }
    ) {
      totalCount
    }
    tagCountConsensual: allTwitterProfile(
      filter: { profile: { tags: { location: { consensual: { eq: true } } } } }
    ) {
      totalCount
    }
    tagCountDesignedby: allTwitterProfile(
      filter: { profile: { tags: { location: { designedby: { eq: true } } } } }
    ) {
      totalCount
    }
    tagCountBreathe: allTwitterProfile(
      filter: { profile: { tags: { location: { breathe: { eq: true } } } } }
    ) {
      totalCount
    }
    tagCountArtist: allTwitterProfile(
      filter: { profile: { tags: { expertise: { artist: { eq: true } } } } }
    ) {
      totalCount
    }
    tagCountMelange: allTwitterProfile(
      filter: { profile: { tags: { location: { melange: { eq: true } } } } }
    ) {
      totalCount
    }
    tagCountDemocracy: allTwitterProfile(
      filter: { profile: { tags: { location: { democracy: { eq: true } } } } }
    ) {
      totalCount
    }
    tagCountKakuma: allTwitterProfile(
      filter: { profile: { tags: { location: { kakuma: { eq: true } } } } }
    ) {
      totalCount
    }
    tagCountFivethings: allTwitterProfile(
      filter: { profile: { tags: { location: { fivethings: { eq: true } } } } }
    ) {
      totalCount
    }
  }
`;
