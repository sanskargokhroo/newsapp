import React, { useEffect, useState } from "react";
import NewsItems from "./NewsItems";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";


const News = (props)=> {
    const [articles, setArticles] = useState([]);
    const [totalResults, setTotalResults] = useState(0);

  
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // eslint-disable-next-line
  const updateNews = async()=> {
    props.setProgress(10);
    const url = `https://gnews.io/api/v4/top-headlines?country=${props.country}&category=${props.category}&apikey=${props.apiKey}&max=${props.pageSize}`;
    
    try {
      let data = await fetch(url);
      let parsedData = await data.json();
      setArticles(parsedData.articles || []);
      // GNews API free tier doesn't support pagination, so limit totalResults to stop infinite loading
      setTotalResults((parsedData.articles || []).length); 
    } catch (error) {
      console.error(error);
      setArticles([]);
    }
    
    
    props.setProgress(100);
  }
   
  useEffect(() => {
    document.title = `NewsAdda - ${capitalizeFirstLetter(props.category)}`;
    updateNews();
    // eslint-disable-next-line
  }, [props.category]);


  const fetchMoreData = async () => {
    // Free tier of GNews doesn't support page parameter, 
    // so this function won't be called as hasMore is now false
  };

 
    return (
      <>
        <h2 className="text-center"style={{margin: "35px 0px",marginTop: "100px",marginBottom: "20px",}}>Top {capitalizeFirstLetter(props.category)} Headlines</h2>

        <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles.length !== totalResults}
          
        >
          <div className="container" style={{overflow: "hidden"}}>
          
          <div className="row">
            {articles.map((element) => {
              return ( 
              <div className="col-md-4" key={element.url}>
                  <NewsItems title={element.title ? element.title : ""}
                    description={element.description? element.description.slice(0, 88): ""}imageUrl={element.image}newsUrl={element.url}author={element.author ? element.author : "Unknown"}date={element.publishedAt? new Date(element.publishedAt).toGMTString(): "Unknown"}
                    source={element.source.name} />
                </div>)
            })}
          </div>
            
          </div>
        </InfiniteScroll>
      </>

    )
  
}

 News.defaultProps = {
    country: "in",
    pageSize: 6,
    category: "general",
  };
  News.propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
  };

export default News;
