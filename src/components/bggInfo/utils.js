import { getI18Ntext } from "@/i18n";
import { noBGGgame } from "@/config/no-bgggame";
import { dependencyLabel } from "@/config/dependencyTypes";

// Ratings BGG
const ratingsBGG = {
  0: "#666e75",
  1: "#b2151f",
  2: "#b2151f",
  3: "#d71925",
  4: "#d71925",
  5: "#5369a2",
  6: "#5369a2",
  7: "#1978b3",
  8: "#1d804c",
  9: "#186b40",
  10: "#186b40",
};

const dependencyToData = (dependency) => {
  // dependency.votes is the backend's Game.dependency_votes JSONField, a
  // {level: voteCount} object (e.g. {"1": 12, "2": 3}), not a delimited string.
  const totalVotes = Object.values(dependency.votes || {}).reduce(
    (accumulator, currentValue) => {
      return accumulator + (parseInt(currentValue, 10) || 0);
    },
    0
  );

  if (totalVotes === 0) {
    return {
      dependency: getI18Ntext("dependencyType.noData"),
      dependencyVotes: 0,
    };
  }

  return {
    dependency: dependencyLabel(dependency?.value || 0),
    dependencyVotes: totalVotes,
  };
};
//
export const getStatsOfElement = (element) => {
  if (!element) {
    return {
      rate: 1,
      rateColor: ratingsBGG[0],
      rateVotes: 1,
      weight: 1,
      weightVotes: 1,
      dependency: {
        most: getI18Ntext("NoData"),
        list: [],
      },
    };
  }

  const {
    bgg_id,
    rate,
    rate_votes,
    weight,
    weight_votes,
    dependency,
    dependency_votes,
    rank,
  } = element;

  return {
    isInBGG: `${bgg_id}` !== noBGGgame.element.bgg_id,
    rate: Math.round((rate || 0) * 10) / 10,
    rateColor: ratingsBGG[Math.floor(rate || 0)],
    rateVotes: parseInt(rate_votes || 0, 10),
    rank,
    weight: Math.round((weight || 0) * 100) / 100,
    weightVotes: parseInt(weight_votes || 0, 10),
    ...dependencyToData({
      value: dependency || 0,
      votes: dependency_votes || {},
    }),
  };
};
