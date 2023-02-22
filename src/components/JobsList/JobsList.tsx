import { useEffect, useState } from "react";
import { Button, Form, Card } from 'react-bootstrap';

/* This code below defines a data type (a fundamental concept in programming that refers to the type of value a variable or constant can store) called "Job", 
which is an object with the following properties:

"jobId": a string representing the unique identifier of the job;
"jobTitle": a string representing the title of the job;
"companyName": a string representing the name of the company offering the job;
"jobDescription": a string representing the job description;
"postingDate": a string representing the date the job was published;
"location": a string representing the location of the job;
"companyLogo": a string representing the image address of the logo of the company offering the job.*/

type Job = {
  jobId: string;
  jobTitle: string;
  companyName: string;
  jobDescription: string;
  postingDate: string;
  location: string;
  companyLogo: string;
};

/* This code below represents the response from an API that returns a set of jobs. 
The "ApiResponse" object has only one property called "jobs", which is an array (or vector) of objects of type "Job".*/

type ApiResponse = {
  jobs: Job[];
};

export default function JobsList() {

  /* Each of these lines of code below defines a state variable that is stored and updated by React. 
  State variables are defined using the useState hook, which is a function that takes an initial value and returns an array with two positions: 
  the first position is the current value of the state variable, and the second position is a function that allows updating. the value of the state variable. */

  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [sorting, setSorting] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [postingDateRange, setPostingDateRange] = useState<string>("7");

  /* This code below is executed when the user types something into a search field in the input.
  The function receives a change event (ChangeEvent) from React, which is triggered whenever the value of a form field is changed.
  The event type is specified as "React.ChangeEvent<HTMLSelectElement>" which means it is a change event on a select element (HTMLSelectElement). */

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  /* This code below is executed when the user selects an option in a form element of type select.
  This function also receives a change event (ChangeEvent) from React, which is triggered whenever the value of a form field is changed. 
  The event type is specified as "React.ChangeEvent<HTMLSelectElement>" which means it is a change event on a select element (HTMLSelectElement).*/

  const handlePostingDateRangeChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setPostingDateRange(e.target.value);
  };

  /* This code below uses React's useEffect hook to fetch data from an API and update the UI.
  In the provided code, useEffect is used to fetch data from an API using the async function "fetchData". 
  The API URL is "https://www.zippia.com/api/jobs/" and the HTTP method used is POST. 
  The body of the request is a JSON string that contains various parameters such as the company's skills, job title, and the number of jobs to pursue. 
  The response is stored in the "data" variable as an "ApiResponse" object.
  After the data is successfully fetched, the "setJobs" function is used to update the "jobs" state variable (which was set using the useState hook somewhere in the component) with the data returned from the API. 
  When the "jobs" state variable is updated, React automatically updates the UI to reflect the change.
  The second argument of useEffect is an empty dependency array, which means that the "fetchData" function will be executed only once, at the time the component is assembled. */

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

  /* In this code below useEffect is used to update the "filteredJobs" state variable based on several user-changeable state variables: "jobs" (the list of all jobs), 
  "searchTerm" (the search term entered by the user), "postingDateRange" (the user-selected posting date range), 
  and "sorting" (whether the job listing should be sorted by the user-selected criteria).
  The code calls the "filterJobs" function (which is not here yet) to filter the list of jobs based on search and sort criteria selected by the user. 
  The "filterJobs" function returns a new filtered job list that meets the search and sort criteria.
  After the new filtered job list is successfully created, the "setFilteredJobs" function is used to update the "filteredJobs" state variable with the new list. 
  When the "filteredJobs" state variable is updated, React automatically updates the UI to reflect the change.
  The second argument to useEffect is a dependency array that contains the state variables that the function depends on to be rerun. */

  useEffect(() => {
    const filtered = filterJobs(jobs);
    setFilteredJobs(filtered);
  }, [jobs, searchTerm, postingDateRange, sorting]);

  /* This code below takes a list of jobs as an argument and returns a new list of jobs filtered based on search and sorting criteria and is called within the useEffect hook 
  to update the state variable " filteredJobs". */

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

  /* That code below takes a string with HTML tags as an argument and returns a new string without those HTML tags. 
  The function uses a regular expression to find all HTML tags in the dirty string and replaces them with an empty string. */

  function stripHtmlTags(dirtyString: string) {
    const regex = /(<([^>]+)>)/gi;
    return dirtyString.replace(regex, '');
  }

  /* This code below takes a string as an argument, representing a job posting date (in the format "yyyy-mm-dd"). 
  The function returns a formatted string that indicates how many days ago the job was posted. */

  const formatPostingDate = (postingDate: string): string => {
    const now = new Date();
    const posting = new Date(postingDate);
    const diffInMs = now.getTime() - posting.getTime();
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
    const daysSincePosting = diffInDays > 0 ? diffInDays : 1;
    return `Posted ${daysSincePosting} day${daysSincePosting > 1 ? 's' : ''} ago`;
  };

  /* And this code below is the return of all this responsive component and your styles */

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

      <div className="row mt-5">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div className="col-4 justify-content-center mt-5" key={job.jobId}>
              <Card className="text-center" style={{ background: "#1c74ff", borderRadius: "50px", boxShadow: "0px 0px 55px rgba(0, 0, 0, 0.25)", marginLeft: "0.8vw", marginRight: "0.8vw", maxWidth: "100%", color: "#fff"}}>
                <Card.Body className="d-flex flex-column justify-content-center align-items-center mt-5">
                  <Card.Title style={{ fontSize: "26px" }}>{job.jobTitle}</Card.Title>
                  <Card.Subtitle className="mt-3" style={{ fontSize: "16px" }}>{job.companyName}</Card.Subtitle>
                  <p className="mt-1" style={{ fontStyle: "italic", fontSize: "14px" }}>{job.location}</p>
                  <div className="mt-4" style={{ textAlign: "justify", paddingLeft: "10px", paddingRight: "10px", width: "100%", maxHeight: "30vh", overflow: "auto", borderRadius: "15px", color: "#fff"}}>
                    <Card.Text className="mt-3" style={{ textAlign: "justify" }}>{job.jobDescription.replace(/<\/?[^>]+(>|$)/g, "")}</Card.Text> 
                  </div>
                  <p className="mt-5" style={{ fontStyle: "italic" }}>{formatPostingDate(job.postingDate)}</p>
                </Card.Body>
              </Card>
            </div>
          ))
        ) : (
          <p className="d-flex flex-wrap justify-content-center align-items-center mt-5" style={{ fontSize: "26px", fontWeight: "bold" }}>No jobs found</p>
        )}
      </div>
    </>
  );
}
