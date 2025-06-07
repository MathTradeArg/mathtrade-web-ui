import resultsData from "./results";

const hyphenRg = new RegExp("_", "g");

// const capitalize = (str) => {
//   return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
// };

export const processResults = () => {
  const list = resultsData.split("\n");

  const aaaa = list
    .map((line) => {
      const [from, to] = line.split("receives ").map((x) => x.trim());
      if (from && to) {
        const [userFrom, itemFrom] = from.split(") ");
        const [, usernameFromRaw] = userFrom.split("---");
        const usernameFrom = usernameFromRaw.replace(hyphenRg, " ");
        const [userTo, itemTo] = to.split(") ");
        const [, usernameToRaw] = userTo.split("---");
        const usernameTo = usernameToRaw.replace(hyphenRg, " ");

        return { usernameFrom, itemFrom, usernameTo, itemTo };
      }
      return null;
    })
    .filter((x) => x);
  console.log(aaaa);
};
