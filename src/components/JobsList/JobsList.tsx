import { useEffect, useState } from "react";
import { Button, Form, Card } from 'react-bootstrap';

type Job = {
  jobId: string;
  jobTitle: string;
  companyName: string;
  jobDescription: string;
  postingDate: string;
  location: string;
  companyLogo: string;
};

type ApiResponse = {
  jobs: Job[];
};

export default function JobsList() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [sorting, setSorting] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [postingDateRange, setPostingDateRange] = useState<string>("7");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handlePostingDateRangeChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setPostingDateRange(e.target.value);
  };

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
          fetchJobdesc: true,
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

  useEffect(() => {
    const filtered = filterJobs(jobs);
    setFilteredJobs(filtered);
  }, [jobs, searchTerm, postingDateRange, sorting]);

  const filterJobs = (jobs: Job[]): Job[] => {
    let filteredJobs = jobs;

    if (searchTerm) {
      filteredJobs = filteredJobs.filter((job) =>
        job.companyName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (postingDateRange) {
      const postingDateRangeInMs = Number(postingDateRange) * 24 * 60 * 60 * 1000;
      const postingDateCutoff = new Date().getTime() - postingDateRangeInMs;

      filteredJobs = filteredJobs.filter((job) => {
        const jobPostingDate = new Date(job.postingDate).getTime();
        return jobPostingDate >= postingDateCutoff;
      });
    }

    if (sorting) {
      filteredJobs = filteredJobs.sort((a, b) =>
        a.companyName.localeCompare(b.companyName)
      );
    }

    return filteredJobs;
  };

  function stripHtmlTags(dirtyString: string) {
    const regex = /(<([^>]+)>)/gi;
    return dirtyString.replace(regex, '');
  }

  const formatPostingDate = (postingDate: string): string => {
    const now = new Date();
    const posting = new Date(postingDate);
    const diffInMs = now.getTime() - posting.getTime();
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
    const daysSincePosting = diffInDays > 0 ? diffInDays : 1;
    return `Posted ${daysSincePosting} day${daysSincePosting > 1 ? 's' : ''} ago`;
  };

  return (
    <>
      <div className="d-flex flex-wrap justify-content-center align-items-center mt-5">
        <div className="w-50">
          <Form.Control
            type="text"
            placeholder="Search by Company Name"
            value={searchTerm}
            onChange={handleSearch}
            className="w-30"
          />
        </div>


        <Button onClick={() => setSorting(!sorting)}>
          <strong>Search</strong>
        </Button>

        <div className="w-30 px-5">
          <Form.Select value={postingDateRange} onChange={handlePostingDateRangeChange}>
            <option value="1">Past Day</option>
            <option value="3">Past 3 Days</option>
            <option value="7">Past Week</option>
            <option value="30">Past Month</option>
          </Form.Select>
        </div>
      </div>

      <div className="row">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div className="row-sm-4 mt-5" key={job.jobId}>
              <Card style={{ backgroundColor: "#f4f7f7" }}>
                <Card.Body className="d-flex flex-wrap mt-5">
                  <Card.Subtitle>{job.companyName}</Card.Subtitle>
                  <p>{job.location}</p>
                  <Card.Title>{job.jobTitle}</Card.Title>
                  <Card.Text>{job.jobDescription.replace(/<\/?[^>]+(>|$)/g, "")}</Card.Text>
                  <p>{formatPostingDate(job.postingDate)}</p>
                </Card.Body>
              </Card>
            </div>
          ))
        ) : (
          <p className="d-flex flex-wrap justify-content-center align-items-center mt-5">No jobs found</p>
        )}
      </div>
    </>
  );
}
