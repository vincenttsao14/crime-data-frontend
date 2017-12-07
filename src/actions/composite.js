import { updateFilters } from './filters'
import { fetchNibrs } from './nibrs'
import { fetchSummaries } from '../actions/summary'
import { fetchUcrParticipation } from '../actions/participation'
import history, { createNewLocation } from '../util/history'
import { getPlaceId } from '../util/location'

import {
  shouldFetchUcr,
  shouldFetchSummaries,
  shouldFetchNibrs,
} from '../util/participation'

const fetchData = () => (dispatch, getState) => {
  const { filters, region, states } = getState()
  if (region.loaded && states.loaded) {
    if (!filters.placeId) {
      filters.placeId = getPlaceId(filters, region.region, states.states);
    }
    if (shouldFetchUcr(filters, region, states)) dispatch(fetchUcrParticipation(filters))
    if (shouldFetchSummaries(filters, region, states)) dispatch(fetchSummaries(filters))
    console.log('shouldFetchNibrs:', shouldFetchNibrs(filters, states))
    if (shouldFetchNibrs(filters, states)) dispatch(fetchNibrs(filters))
  }
}

export const updateApp = (change, router) => dispatch => {
  dispatch(updateFilters(change))

  if (router) {
    const loc = createNewLocation({ change, router })
    if (window.caches) {
      caches
        .open('crime-data-explorer')
        .then(cache => cache.addAll([loc.pathname]))
    }
    history.push(loc)
  }

  return dispatch(fetchData())
}
