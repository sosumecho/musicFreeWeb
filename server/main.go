package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
	"os"
	"os/exec"
	"strings"
)

func cmd(typ string, args ...string) ([]byte, error) {
	command := exec.Command("node", append([]string{"src/index.js", typ}, args...)...)
	command.Dir = "./plugin"
	return command.CombinedOutput()
}

func Search(c *gin.Context) {
	var params struct {
		Page  string `json:"page"`
		Query string `json:"query"`
		Hash  string `json:"hash"`
		Type  string `json:"type"`
	}
	_ = c.ShouldBind(&params)

	rs, err := cmd("search", params.Hash, params.Query, params.Page, params.Type)
	if err != nil {
		_ = c.Error(err)
		return
	}
	c.Data(http.StatusOK, "application/json", rs)
}

func GetTopLists(c *gin.Context) {
	var params struct {
		Hash []string `json:"hash" form:"hash"`
	}
	_ = c.ShouldBind(&params)

	rs, err := cmd("getTopLists", strings.Join(params.Hash, ","))
	if err != nil {
		_ = c.Error(err)
		return
	}
	c.Data(http.StatusOK, "application/json", rs)
}

func GetTopListDetail(c *gin.Context) {
	var item struct {
		Page string `json:"page" form:"page"`
		Name string `json:"name" form:"name"`
		Data string `json:"data" form:"data"`
	}
	_ = c.ShouldBind(&item)
	rs, err := cmd("getTopListDetail", item.Name, item.Data, item.Page)
	if err != nil {
		_ = c.Error(err)
		return
	}
	c.Data(http.StatusOK, "application/json", rs)
}

func GetMediaSource(c *gin.Context) {
	var params struct {
		Quality string `json:"quality"`
		Data    string `json:"data"`
	}
	_ = c.BindJSON(&params)
	rs, err := cmd("getMediaSource", params.Data, params.Quality)
	if err != nil {
		_ = c.Error(err)
		return
	}
	c.Data(http.StatusOK, "application/json", rs)
}

func GetPlugins(c *gin.Context) {
	rs, err := cmd("plugins")
	if err != nil {
		_ = c.Error(err)
		return
	}
	c.Data(http.StatusOK, "application/json", rs)
}

func InstallPlugins(c *gin.Context) {
	var params struct {
		URL string `json:"url"`
	}
	_ = c.BindJSON(&params)
	rs, err := cmd("installPlugins", params.URL)
	if err != nil {
		_ = c.Error(err)
		return
	}
	c.Data(http.StatusOK, "application/json", rs)
}

func DeletePlugin(c *gin.Context) {
	hash := c.Param("hash")
	rs, err := cmd("deletePlugin", hash)
	if err != nil {
		_ = c.Error(err)
		return
	}
	c.Data(http.StatusOK, "application/json", rs)
}

func GetPluginByHash(c *gin.Context) {
	hash := c.Param("hash")
	rs, err := cmd("getPlugin", hash)
	if err != nil {
		_ = c.Error(err)
		return
	}
	c.Data(http.StatusOK, "application/json", rs)
}

func SupportPlugins(c *gin.Context) {
	method := c.Param("method")
	rs, err := cmd("supportPlugins", method)
	if err != nil {
		_ = c.Error(err)
		return
	}
	c.Data(http.StatusOK, "application/json", rs)
}

func SearchablePlugins(c *gin.Context) {
	method := c.Param("method")
	rs, err := cmd("searchablePlugins", method)
	if err != nil {
		_ = c.Error(err)
		return
	}
	c.Data(http.StatusOK, "application/json", rs)
}

func GetRecommendSheetTags(c *gin.Context) {
	hash := c.Param("hash")
	rs, err := cmd("getRecommendSheetTags", hash)
	if err != nil {
		_ = c.Error(err)
		return
	}
	c.Data(http.StatusOK, "application/json", rs)
}

func GetMusicSheetInfo(c *gin.Context) {
	item := c.Query("item")
	page := c.Query("page")
	rs, err := cmd("getMusicSheetInfo", item, page)
	if err != nil {
		_ = c.Error(err)
		return
	}
	c.Data(http.StatusOK, "application/json", rs)
}

func GetRecommendSheetByTag(c *gin.Context) {
	hash := c.Param("hash")
	tag := c.Param("tag")
	page := c.Query("page")
	rs, err := cmd("getRecommendSheetByTag", hash, tag, page)
	if err != nil {
		_ = c.Error(err)
		return
	}
	c.Data(http.StatusOK, "application/json", rs)
}
func main() {
	r := gin.Default()
	r.Use(func(c *gin.Context) {
		origin := c.Request.Header.Get("Origin")
		if origin != "" {
			c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
			c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			c.Writer.Header().Set("Access-Control-Allow-Headers", "Origin, Content-Length, Content-Type, Authorization")
		}
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}
		c.Next()
	})
	r.Static("/web", "./web")
	r.POST("/search", Search)
	r.GET("/top", GetTopLists)
	r.POST("/top/detail", GetTopListDetail)
	r.GET("/recommend/:hash", GetRecommendSheetTags)
	r.GET("/recommend/:hash/:tag", GetRecommendSheetByTag)
	r.POST("/music", GetMediaSource)
	r.GET("/music-sheet", GetMusicSheetInfo)
	r.GET("/plugins", GetPlugins)
	r.POST("/plugins", InstallPlugins)
	r.DELETE("/plugin/:hash", DeletePlugin)
	r.GET("/plugin/:hash", GetPluginByHash)
	r.GET("/plugins/support/:method", SupportPlugins)
	r.GET("/plugins/searchable/:method", SearchablePlugins)
	r.GET("/", func(c *gin.Context) {
		c.Redirect(http.StatusPermanentRedirect, "/web")
	})
	port := os.Getenv("API_PORT")
	if port == "" {
		port = "18888"
	}
	_ = r.Run(fmt.Sprintf(":%s", port))
}
