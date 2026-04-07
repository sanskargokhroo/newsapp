import React, { useEffect, useState } from "react";
import NewsItems from "./NewsItems";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";


const News = (props)=> {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState([true]);
    const [page, setPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);

  
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const updateNews = async()=> {
    props.setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
    setLoading(true);
    let data = await fetch(url);
    let parsedData = await data.json();
    setArticles(parsedData.articles);
    setTotalResults(parsedData.totalResults);
    setLoading(false);
    
    props.setProgress(100);
  }
   
  useEffect(() => {
    document.title = `NewsAdda - ${capitalizeFirstLetter(props.category)}`;
    updateNews();
  }, []);


  const fetchMoreData = async () => {
   
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page+1}&pageSize=${props.pageSize}`;
     setPage(page + 1); 
    let data = await fetch(url);
    let parsedData = await data.json();
    setArticles(articles.concat(parsedData.articles));
    setTotalResults(parsedData.totalResults);

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
                    description={element.description? element.description.slice(0, 88): ""}imageUrl={element.urlToImage}newsUrl={element.url}author={element.author ? element.author : "Unknown"}date={element.publishedAt? new Date(element.publishedAt).toGMTString(): "Unknown"}
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
