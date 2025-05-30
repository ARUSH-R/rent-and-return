import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import UserDashboard from "../pages/UserDashboard";
import AdminPanel from "../pages/AdminPanel";
import Unauthorized from "../pages/Unauthorized";
import jwt from "jwt-decode";

const renderWithToken = (token, initialRoute) => {
  // mock localStorage and token
  jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => token);

  render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route element={<ProtectedRoute allowedRoles={['USER']} />}>
          <Route path="/user" element={<UserDashboard />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route path="/admin" element={<AdminPanel />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
};

describe("Role-Based Access Control", () => {
  const mockTokenUser = () => {
    const payload = {
      sub: "user@test.com",
      role: "USER",
      exp: Math.floor(Date.now() / 1000) + 600
    };
    return btoa(JSON.stringify({ alg: "HS256", typ: "JWT" })) + "." + 
           btoa(JSON.stringify(payload)) + ".signature";
  };

  const mockTokenAdmin = () => {
    const payload = {
      sub: "admin@test.com",
      role: "ADMIN",
      exp: Math.floor(Date.now() / 1000) + 600
    };
    return btoa(JSON.stringify({ alg: "HS256", typ: "JWT" })) + "." + 
           btoa(JSON.stringify(payload)) + ".signature";
  };

  it("allows USER to access /user but blocks /admin", () => {
    renderWithToken(mockTokenUser(), "/user");
    expect(screen.getByText(/User Dashboard/i)).toBeInTheDocument();

    renderWithToken(mockTokenUser(), "/admin");
    expect(screen.getByText(/Unauthorized/i)).toBeInTheDocument();
  });

  it("allows ADMIN to access /admin", () => {
    renderWithToken(mockTokenAdmin(), "/admin");
    expect(screen.getByText(/Admin Panel/i)).toBeInTheDocument();
  });

  it("blocks unauthorized access with no token", () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => null);
    renderWithToken(null, "/admin");
    expect(screen.getByText(/Unauthorized/i)).toBeInTheDocument();
  });
});
