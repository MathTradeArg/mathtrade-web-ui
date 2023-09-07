import { useEffect, useState } from "react";
import storage from "utils/storage";
import moment from "moment";

const useCanEdit = (type) => {
  /*   const [canEdit, setCantEdit] = useState(false);

  useEffect(() => {
    const mathtrade = storage.getFromStore("mathtrade");
    let dateToCompare = null;

    const today = moment(); // "2023-04-26T13:30:00-03:00"
    let newCanEdit;

    if (mathtrade) {
      switch (type) {
        case "list":
          dateToCompare = mathtrade?.frezze_geek_date;
          newCanEdit = today.isBefore(dateToCompare);
          break;
        case "wants":
          dateToCompare = mathtrade?.frezze_wants_date;
          newCanEdit = today.isBefore(dateToCompare);
          break;
        case "results":
          // isAfter;
          dateToCompare = mathtrade?.show_results_date;
          newCanEdit = true; //today.isAfter(dateToCompare);
          break;
        default:
        //
      }

      setCantEdit(newCanEdit);
    }
  }, [type]); */

  return true; //canEdit;
};

export default useCanEdit;
