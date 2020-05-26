import { renderHook } from '@testing-library/react-hooks';
import * as reactRedux from 'react-redux';
import { showGlobalNotification } from 'containers/App/actions';
import { TYPE_LOCAL, VARIANT_ERROR } from 'containers/Notification/constants';
import useFetchIncident from './index';

const dispatch = jest.fn();
jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatch);

describe('useFetchIncident service', () => {
  beforeEach(() => {
    fetch.resetMocks();
    dispatch.mockReset();
  });

  it('should return the empty data when incident no id provided', async () => {
    const { result } = renderHook(() => useFetchIncident());
    expect(result.current).toEqual({ isLoading: false, incident: undefined, attachements: undefined });
    expect(fetch).not.toHaveBeenCalled();
  });

  it('should return the incident data when id is provided', async () => {
    const mockIncident = { name: 'incident' };
    const mockAttachements = { results: [{ id: 1 }, { id: 2 }] };
    fetch.mockResponseOnce(JSON.stringify(mockIncident)).mockResponseOnce(JSON.stringify(mockAttachements));

    const { result, waitForNextUpdate } = renderHook(() => useFetchIncident(1));
    expect(result.current.isLoading).toEqual(true);
    expect(result.current.incident).toBeUndefined();
    expect(result.current.attachments).toBeUndefined();

    await waitForNextUpdate();

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(result.current.isLoading).toEqual(false);
    expect(result.current.incident).toEqual(mockIncident);
    expect(result.current.attachments).toEqual(mockAttachements.results);
  });

  it('should dispatch an global error when an error occurs', async () => {
    const error = new Error();
    fetch.mockRejectOnce(error);

    const { result, waitForNextUpdate } = renderHook(() => useFetchIncident(1));
    expect(result.current.isLoading).toEqual(true);
    expect(result.current.incident).toBeUndefined();
    expect(result.current.attachments).toBeUndefined();
    expect(dispatch).not.toHaveBeenCalled();

    await waitForNextUpdate();

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(result.current.isLoading).toEqual(false);
    expect(dispatch).toHaveBeenCalledWith(
      showGlobalNotification({
        message: 'De melding gegevens konden niet opgehaald worden',
        title: 'Splitsen',
        variant: VARIANT_ERROR,
        type: TYPE_LOCAL,
      })
    );
  });
});
