import React, { Fragment } from "react";
import GeneralNoNav from "../../../../components/graderCreate/Layout/gSide";
import GNav from "../../../../components/graderCreate/Layout/gNav";

import QList from "../../../../components/graderCreate/Question/QList/QList";

const Question = () => {
  return (
    <Fragment>
      <GeneralNoNav>
        <GNav></GNav>
        <QList />
      </GeneralNoNav>
    </Fragment>
  );
};
export default Question;