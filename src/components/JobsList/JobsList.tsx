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
  const [postingDateRange, setPostingDateRange] = useState<string>("30");

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

      <div className="row mt-5 mb-5" style={{ marginLeft: "1.5vw", marginRight: "1.5vw", maxWidth: "100%" }}>
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div className="col-10 col-sm-6 col-md-4 col-lg-3 justify-content-center mx-auto mt-5" key={job.jobId}>
              <Card className="text-center" style={{ backgroundImage: "linear-gradient(to top, #0250c5 0%, #eb144c 100%)", borderRadius: "50px", boxShadow: "0px 0px 55px rgba(0, 0, 0, 0.25)", color: "#fff" }}>
                <svg width="100%" height="100%" id="svg" viewBox="0 0 1440 690" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: "50px" }} className="transition duration-300 ease-in-out delay-150"><defs><linearGradient id="gradient" x1="99%" y1="61%" x2="1%" y2="39%"><stop offset="5%" stop-color="#343a40"></stop><stop offset="95%" stop-color="#eb144c"></stop></linearGradient></defs><path d="M 0,700 C 0,700 0,175 0,175 C 82.133971291866,150.20574162679426 164.267942583732,125.41148325358853 254,130 C 343.732057416268,134.58851674641147 441.0622009569378,168.5598086124402 541,197 C 640.9377990430622,225.4401913875598 743.4832535885166,248.34928229665073 851,233 C 958.5167464114834,217.65071770334927 1071.0047846889954,164.04306220095694 1170,148 C 1268.9952153110046,131.95693779904306 1354.4976076555022,153.47846889952154 1440,175 C 1440,175 1440,700 1440,700 Z" stroke="none" stroke-width="0" fill="url(#gradient)" fill-opacity="0.4" className="transition-all duration-300 ease-in-out delay-150 path-0" transform="rotate(-180 720 350)"></path><defs><linearGradient id="gradient" x1="99%" y1="61%" x2="1%" y2="39%"><stop offset="5%" stop-color="#343a40"></stop><stop offset="95%" stop-color="#eb144c"></stop></linearGradient></defs><path d="M 0,700 C 0,700 0,350 0,350 C 93.65550239234452,368.4019138755981 187.31100478468903,386.80382775119614 287,397 C 386.68899521531097,407.19617224880386 492.4114832535885,409.1866028708134 595,387 C 697.5885167464115,364.8133971291866 797.043062200957,318.44976076555025 900,301 C 1002.956937799043,283.55023923444975 1109.4162679425838,295.0143540669856 1200,308 C 1290.5837320574162,320.9856459330144 1365.2918660287082,335.4928229665072 1440,350 C 1440,350 1440,700 1440,700 Z" stroke="none" stroke-width="0" fill="url(#gradient)" fill-opacity="0.53" className="transition-all duration-300 ease-in-out delay-150 path-1" transform="rotate(-180 720 350)"></path><defs><linearGradient id="gradient" x1="99%" y1="61%" x2="1%" y2="39%"><stop offset="5%" stop-color="#343a40"></stop><stop offset="95%" stop-color="#eb144c"></stop></linearGradient></defs><path d="M 0,700 C 0,700 0,525 0,525 C 114.95693779904306,554.8277511961722 229.91387559808612,584.6555023923445 332,573 C 434.0861244019139,561.3444976076555 523.3014354066987,508.2057416267943 604,498 C 684.6985645933013,487.7942583732057 756.8803827751196,520.5215311004785 845,542 C 933.1196172248804,563.4784688995215 1037.177033492823,573.7081339712919 1139,569 C 1240.822966507177,564.2918660287081 1340.4114832535884,544.6459330143541 1440,525 C 1440,525 1440,700 1440,700 Z" stroke="none" stroke-width="0" fill="url(#gradient)" fill-opacity="1" className="transition-all duration-300 ease-in-out delay-150 path-2" transform="rotate(-180 720 350)"></path></svg>
                <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                  <Card.Title style={{ fontSize: "1.3rem", fontFamily: "'Inter', sans-serif" }}>{job.jobTitle}</Card.Title>
                  <Card.Subtitle className="mt-3" style={{ fontSize: "15px" }}>{job.companyName}</Card.Subtitle>
                  <p className="mt-1" style={{ fontStyle: "italic", fontSize: "14px" }}>{job.location}</p>
                  <div className="mt-3" style={{ background: "rgba(255, 255, 255, 0.2)", opacity: "0.7", textAlign: "justify", width: "100%", maxHeight: "35vh", overflow: "auto", borderRadius: "15px", color: "#fff", padding: "1px", border: "3px solid blue" }}>
                    <Card.Text className="mt-3" style={{ textAlign: "justify", paddingLeft: "20px", paddingRight: "20px", fontFamily: "'Roboto', sans-serif", fontSize: "14px" }}>{job.jobDescription.replace(/<\/?[^>]+(>|$)/g, "")}</Card.Text>
                  </div>
                  <p className="mt-4" style={{ fontWeight: "bold", fontSize: "16px" }}>{formatPostingDate(job.postingDate)}</p>
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
