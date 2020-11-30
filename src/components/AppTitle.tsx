import React from 'react';

const AppTitle: React.FunctionComponent = () => {
  return (
    <div className="app-title">
      <div className="app-title-name">Math Hunger</div>
      <div className="app-title-version">v{appVersion}</div>
    </div>
  );
};

export default AppTitle;
