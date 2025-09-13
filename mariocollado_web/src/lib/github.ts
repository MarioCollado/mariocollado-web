import { Octokit } from "@octokit/rest";

export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
}

/**
 * Obtiene los repositorios de GitHub de un usuario
 */
export async function getGitHubRepos(
  username: string,
  limit: number = 6
): Promise<GitHubRepo[]> {
  const octokit = new Octokit({
    auth: import.meta.env.GITHUB_TOKEN,
  });

  try {
    const { data } = await octokit.repos.listForUser({
      username,
      sort: "updated",
      direction: "desc",
      per_page: limit,
    });

    return data.map(
      (repo): GitHubRepo => ({
        id: Number(repo.id),
        name: String(repo.name),
        description: repo.description ? String(repo.description) : null,
        html_url: String(repo.html_url),
        language: repo.language ? String(repo.language) : null,
        stargazers_count: Number(repo.stargazers_count || 0),
        forks_count: Number(repo.forks_count || 0),
        updated_at: String(repo.updated_at),
      })
    );
  } catch (error) {
    console.error("Error fetching GitHub repos:", error);
    return [];
  }
}

/**
 * Formatea la fecha de actualización del repositorio
 */
export function formatRepoDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("es-ES", {
    month: "short",
    year: "numeric",
  });
}
