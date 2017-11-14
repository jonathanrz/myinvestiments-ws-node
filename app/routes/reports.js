import investments from "../reports/investments";
import summary from "../reports/summary";
import holder from "../reports/holder";
import due_date from "../reports/due_date";

function root(router) {
  router.route("/reports/investments/:investment_id").get((req, res) => {
    investments.generate_report(req.params.investment_id, res);
  });
  router.route("/reports/summary").get((req, res) => {
    summary.generate_report(res);
  });
  router.route("/reports/holder/:holder").get((req, res) => {
    holder.generate_report(req.params.holder, res);
  });
  router.route("/reports/due_date").get((req, res) => {
    due_date.generate_report(res);
  });
}

const map_routes = router => {
  root(router);
};

export default map_routes;
