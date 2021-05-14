// constructor
const Mplus = function (mplus) {
    this.counter = mplus.counter;
    this.completed = mplus.completed;
    this.completionDate = mplus.completionDate;
};

Mplus.updateById = (id, mplus, result) => {
    sql.query(
      "UPDATE Mplus SET counter = ?, completed = ?, completionDate = ? WHERE id = ?",
      [mplus.counter, mplus.completed, mplus.completionDate, id],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
  
        if (res.affectedRows == 0) {
          // not found Customer with the id
          result({ kind: "not_found" }, null);
          return;
        }
  
        console.log("updated mplus: ", { id: id, ...mplus });
        result(null, { id: id, ...mplus });
      }
    );
  };
