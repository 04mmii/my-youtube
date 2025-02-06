import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import Main from "../components/section/Main";
import VideoSearch from "../components/videos/VideoSearch";
import { fetchFromAPI } from "../utils/api";

const Search = () => {
  const { searchId } = useParams();
  const [videos, setVideos] = useState([]);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchVideos = useCallback((query, pageToken = "") => {
    setIsLoading(true);
    setError(null);
    fetchFromAPI(`search?part=snippet&q=${query}&pageToken=${pageToken}`)
      .then((data) => {
        setNextPageToken(data.nextPageToken);
        setVideos((prevVideos) => [...prevVideos, ...data.items]);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError("Failed to fetch videos. Please try again.");
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    setVideos([]);
    fetchVideos(searchId);
  }, [searchId, fetchVideos]);

  const handleLoadMore = () => {
    if (nextPageToken && !isLoading) {
      fetchVideos(searchId, nextPageToken);
    }
  };

  // const searchPageClass = loading ? "isLoading" : "isLoaded";

  return (
    <Main title="유튜브 검색" description="유튜브 검색 결과 페이지입니다.">
      <section id="searchPage">
        <h2>
          🤠 <em>{searchId}</em> 검색 결과입니다.
        </h2>
        {error && <p className="error-message">{error}</p>}
        <div className="video__inner search">
          <VideoSearch videos={videos} />
        </div>
        <div className="video__more">
          {isLoading && <p>Loading...</p>}
          {!isLoading && nextPageToken && (
            <button onClick={handleLoadMore}>더 보기</button>
          )}
        </div>
      </section>
    </Main>
  );
};

export default Search;
