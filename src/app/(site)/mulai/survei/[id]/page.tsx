import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { SurveyWizard } from "@/components/projects/survey-wizard";
import { Container, Em } from "@/components/ui/section";
import { requireUser } from "@/lib/auth";
import { getOwnedProject, getProjectFiles } from "@/lib/projects";
import { parseSurvey } from "@/lib/survey";

export const metadata: Metadata = {
  title: "Survei kebutuhan website",
  robots: { index: false, follow: false },
};

export default async function SurveyPage({ params }: PageProps<"/mulai/survei/[id]">) {
  const { id } = await params;
  const user = await requireUser(`/mulai/survei/${id}`);
  const project = await getOwnedProject(id, user.id);
  if (!project) notFound();
  if (project.status !== "draft") redirect(`/proyek/${id}`);

  const files = await getProjectFiles(id);

  return (
    <>
      <PageHero
        kicker="Design Anything"
        title={
          <>
            Ceritakan <Em tone="ink">kebutuhan Anda.</Em>
          </>
        }
      />
      <section className="pb-24">
        <Container className="max-w-4xl">
          <SurveyWizard
            projectId={project.id}
            initialSurvey={parseSurvey(project.survey)}
            initialStep={project.surveyStep}
            initialFiles={files.map((f) => ({ id: f.id, kind: f.kind, name: f.name }))}
          />
        </Container>
      </section>
    </>
  );
}
