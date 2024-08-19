const getDateMathtrade = () => {
  const d = new Date();

  const year = d.getFullYear();
  //
  d.setDate(d.getDate() - 10);
  const start_date = d.toISOString();
  //
  d.setDate(d.getDate() + 8);
  const frezze_geek_date = d.toISOString();
  //
  d.setDate(d.getDate() + 15);
  const frezze_wants_date = d.toISOString();
  //
  d.setDate(d.getDate() + 1);
  const show_results_date = d.toISOString();
  //
  d.setDate(d.getDate() + 12);
  const meeting_date = d.toISOString();
  //

  return {
    name: `Math Trade ${year}`,
    start_date,
    frezze_geek_date,
    frezze_wants_date,
    show_results_date,
    meeting_date,
  };
};
export default getDateMathtrade;
