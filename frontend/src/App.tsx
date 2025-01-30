import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import AllEntries from "./routes/AllEntries";
import EditEntry from "./routes/EditEntry";
import NewEntry from "./routes/NewEntry";
import { EntryProvider, ThemeProvider } from "./utilities/globalContext";

export default function App() {
  return (
    <section className="min-w-screen min-h-screen dark:bg-neutral-900">
      <Router>
        <EntryProvider>
          <ThemeProvider>
            <NavBar></NavBar>
            <Routes>
              <Route path="/" element={<AllEntries />}></Route>
              <Route path="create" element={<NewEntry />}></Route>
              <Route path="edit/:id" element={<EditEntry />}></Route>
            </Routes>
          </ThemeProvider>
        </EntryProvider>
      </Router>
    </section>
  );
}
