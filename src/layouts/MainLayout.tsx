import { Outlet } from "react-router-dom";
import TopBar from "../components/header/TopBar";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <Header />

      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;
