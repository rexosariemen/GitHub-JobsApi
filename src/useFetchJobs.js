import { useReducer, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = 'https://cors-anywhere.herokuapp.com/https://jobs.github.com/positions.json';
const ACTIONS = {
  MAKE_REQUEST: 'make_request',
  GET_DATA: 'get-data',
  ERROR: 'error',
  UPDATE_HAS_NEXT_PAGE: 'update-has-next-page',
}

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.MAKE_REQUEST:
      return { laoding: true, jobs: [] }
    case ACTIONS.GET_DATA: 
      return { ...state, loading: false, jobs: action.payload.jobs }
    case ACTIONS.ERROR:
      return { ...state, loading: false, error: action.payload.error }
    case ACTIONS.UPDATE_HAS_NEXT_PAGE:
      return { ...state, hasNextPage: action.payload.hasNextPage, }
    default:
      return state;
  }
}

function useFetchJobs(params, page) {
  const [state, dispatch] = useReducer(reducer, { jobs: [], loading: true });

  useEffect(() => {
    const cancelToken1 = axios.CancelToken.source();
    const cancelToken2 = axios.CancelToken.source();

    dispatch({ type: ACTIONS.MAKE_REQUEST })
    axios.get(BASE_URL, {
      params: { markdown: true, page: page, ...params }
    }).then(res => {
      dispatch({ type: ACTIONS.GET_DATA, payload: { jobs: res.data }})
    })
    .catch(e => {
      if (axios.isCancel(e)) return;
      dispatch({ type: ACTIONS.ERROR, payload: { error: e}})
    });

    axios.get(BASE_URL, {
      params: { markdown: true, page: page, ...params }
    }).then(res => {
      dispatch({ type: ACTIONS.UPDATE_HAS_NEXT_PAGE,
        payload: { hasNextPage: res.data.length !== 0 }
      })
    })
    .catch(e => {
      if (axios.isCancel(e)) return;
      dispatch({ type: ACTIONS.ERROR, payload: { error: e}})
    });

    return () => {
      cancelToken1.cancel();
      cancelToken2.cancel();
    }
  }, [params, page])
  console.log('state: ', state);
  return state;
}

export default useFetchJobs;