import { redirect } from "next/navigation";

export default function ProjectsRedirectPage() {
  // We no longer have a generic projects list screen.
  // The home screen is now the Project Details screen for the most recent project.
  redirect("/dashboard");
}
