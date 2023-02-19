import { useEffect, useState } from "react";

type Job = {
  jobId: string;
  jobTitle: string;
  companyName: string;
  jobdesc: string;
};

type ApiResponse = {
  jobs: Job[];
};

export default function JobsList() {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("https://www.zippia.com/api/jobs/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companySkills: true,
          dismissedListingHashes: [],
          fetchJobDesc: true,
          jobTitle: "Business Analyst",
          locations: [],
          numJobs: 10,
          previousListingHashes: [],
        }),
      });

      const data: ApiResponse = await response.json();
      setJobs(data.jobs);
    }

    fetchData();
  }, []);

  return (
    <div>
      {jobs.map((job) => (
        <div key={job.jobId}>
          <h2>{job.jobTitle}</h2>
          <p>{job.companyName}</p>
          <p>{job.jobdesc}</p>
        </div>
      ))}
    </div>
  );
}
