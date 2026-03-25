import React from "react";
import { createBrowserRouter } from "react-router";
import { Root } from "./layouts/Root";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Home } from "./pages/Home";
import { JobsListing } from "./pages/JobsListing";
import { JobDetails } from "./pages/JobDetails";
import { CompaniesDirectory } from "./pages/CompaniesDirectory";
import { CompanyProfile } from "./pages/CompanyProfile";
import { About } from "./pages/About";
import { Articles } from "./pages/Articles";
import { People } from "./pages/People";
import { Learning } from "./pages/Learning";
import { Support } from "./pages/Support";
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import { ForgotPassword } from "./pages/auth/ForgotPassword";
import { VerifyOTP } from "./pages/auth/VerifyOTP";
import { JobSeekerDashboard } from "./pages/job-seeker/Dashboard";
import { Applications } from "./pages/job-seeker/Applications";
import { SavedJobs } from "./pages/job-seeker/SavedJobs";
import { Profile } from "./pages/job-seeker/Profile";
import { ResumeManager } from "./pages/job-seeker/ResumeManager";
import { Messages } from "./pages/job-seeker/Messages";
import { Notifications } from "./pages/job-seeker/Notifications";
import { Network } from "./pages/job-seeker/Network";
import { JobSeekerSettings } from "./pages/job-seeker/Settings";
import { EmployerDashboard } from "./pages/employer/Dashboard";
import { ManageJobs } from "./pages/employer/ManageJobs";
import { Applicants } from "./pages/employer/Applicants";
import { PostJob } from "./pages/employer/PostJob";
import { Analytics } from "./pages/employer/Analytics";
import { EmployerSettings } from "./pages/employer/Settings";
import { AdminDashboard } from "./pages/admin/Dashboard";
import { NotFound } from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "companies", Component: CompaniesDirectory },
      { path: "companies/:id", Component: CompanyProfile },
      { path: "about", Component: About },
      { path: "articles", Component: Articles },
      { path: "people", Component: People },
      { path: "learning", Component: Learning },
      { path: "support", Component: Support },
      { path: "login", Component: Login },
      { path: "register", Component: Register },
      { path: "verify-otp", Component: VerifyOTP },
      { path: "forgot-password", Component: ForgotPassword },
      
      // Protected General Routes
      {
        element: React.createElement(ProtectedRoute, null),
        children: [
          { path: "jobs", Component: JobsListing },
          { path: "jobs/:id", Component: JobDetails },
        ]
      },

      // Protected Seeker Routes
      {
        element: React.createElement(ProtectedRoute, { allowedRoles: ['seeker'] }),
        children: [
          { path: "seeker/dashboard", Component: JobSeekerDashboard },
          { path: "seeker/applications", Component: Applications },
          { path: "seeker/saved", Component: SavedJobs },
          { path: "seeker/profile", Component: Profile },
          { path: "seeker/resumes", Component: ResumeManager },
          { path: "seeker/messages", Component: Messages },
          { path: "seeker/notifications", Component: Notifications },
          { path: "seeker/network", Component: Network },
          { path: "seeker/settings", Component: JobSeekerSettings },
        ]
      },

      // Protected Employer Routes
      {
        element: React.createElement(ProtectedRoute, { allowedRoles: ['employer'] }),
        children: [
          { path: "employer/dashboard", Component: EmployerDashboard },
          { path: "employer/jobs", Component: ManageJobs },
          { path: "employer/applicants", Component: Applicants },
          { path: "employer/post-job", Component: PostJob },
          { path: "employer/analytics", Component: Analytics },
          { path: "employer/settings", Component: EmployerSettings },
        ]
      },

      // Protected Admin Routes
      {
        element: React.createElement(ProtectedRoute, { allowedRoles: ['admin'] }),
        children: [
          { path: "admin/dashboard", Component: AdminDashboard },
        ]
      },

      { path: "*", Component: NotFound },
    ],
  },
]);
