import React from "react";

const Layout = ({ children, title }) => {
  return (
    <main>
      <header>
        <h1>{title}</h1>
      </header>
      <div className="main-container">{children}</div>
    </main>
  );
};

export default Layout;
