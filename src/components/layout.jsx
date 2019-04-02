import React from "react";

const Layout = ({ children, title }) => {
  return (
    <main>
      <header>
        <h1>{title}</h1>
        <span className="user-name">
            {window.localStorage.getItem('active_user')}
        </span>
      </header>
      <div className="main-container">{children}</div>
    </main>
  );
};

export default Layout;
