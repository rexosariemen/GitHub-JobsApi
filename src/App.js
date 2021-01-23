import React, { useState } from 'react';
import useFetchJobs from './useFetchJobs';
import { Container } from 'react-bootstrap';



function App() {
  const [params, setParams] = useState({});
  const [page, setPage] = useState(1);

  const { jobs, loading, error } = useFetchJobs();

  return (
    <Container>
      {loading && <h1>Loading...</h1>}
      {error && <h1>Error...Please refresh your page!</h1>}
      {jobs.length}
      {/* {jobs.map(job => {
        return <Job key={job.id} job={job} />
      })} */}
    </Container>
  );
}

export default App;
