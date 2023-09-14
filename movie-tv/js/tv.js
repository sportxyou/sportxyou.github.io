 angular
        .module("mtApp", [])
        .controller("mtController", function ($scope, $http, $window) {
          var apiKey = "a79576e54c5bbb893011b98ca48f2460";
          var tvId = getParameterByName("id");

          $scope.searchMediaType = "movie"; // Set jenis pencarian default ke "Movie"

          // Tambahkan fungsi pencarian
          $scope.search = function () {
            var searchQuery = $scope.searchQuery;
            var searchMediaType = $scope.searchMediaType; // Simpan jenis media dalam variabel

            if (searchQuery) {
              var apiUrl = `https://api.themoviedb.org/3/search/${searchMediaType}?api_key=${apiKey}&query=${searchQuery}`;

              // Lakukan permintaan HTTP untuk mencari data
              $http
                .get(apiUrl)
                .then(function (response) {
                  $scope.searchResults = response.data.results;

                  // Jika tidak ada hasil, tampilkan pesan
                  if ($scope.searchResults.length === 0) {
                    $scope.searchResults = [
                      { title: "n/a" },
                    ];
                  }
                })
                .catch(function (error) {
                  console.error("Error fetching search results:", error);
                })
                .finally(function () {
                  $scope.searchQuery = ""; // Hapus isi kotak pencarian setelah pencarian selesai
                });
            } else {
              // Jika kotak pencarian kosong, hapus hasil pencarian
              $scope.searchResults = [];
            }
          };

          // Fungsi untuk mengarahkan pengguna ke halaman yang sesuai
          $scope.goToMediaDetail = function (media) {
            if ($scope.searchMediaType === "movie") {
              $window.location.href = "movie.html?id=" + media.id;
            } else if ($scope.searchMediaType === "tv") {
              $window.location.href = "tv.html?id=" + media.id;
            }
          };

          $http
            .get(
              "https://api.themoviedb.org/3/tv/" +
                tvId +
                "?language=en-US&api_key=" +
                apiKey
            )
            .then(
              function (response) {
                $scope.tvShow = response.data;
              },
              function (error) {
                console.error("Error fetching detail acara TV:", error);
              }
            );

          $scope.showEpisodes = function (season) {
            var episodeUrl =
              "https://api.themoviedb.org/3/tv/" +
              tvId +
              "/season/" +
              season.season_number +
              "?language=en-US&api_key=" +
              apiKey;

            $http.get(episodeUrl).then(
              function (episodeResponse) {
                console.log(episodeResponse.data); // Tambahkan ini
                $scope.selectedSeason = season;
                $scope.episodes = episodeResponse.data.episodes;
              },
              function (error) {
                console.error("Error fetching episode acara TV:", error);
              }
            );
          };

          $scope.getPosterUrl = function (posterPath) {
            return posterPath
              ? "https://image.tmdb.org/t/p/w200/" + posterPath
              : "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg";
          };

          $scope.getBackdropUrl = function (backdropPath) {
            return backdropPath
              ? "https://image.tmdb.org/t/p/w300/" + backdropPath
              : "";
          };

$scope.goToEpisodeDetail = function (seasonNumber, episodeNumber) {
  var tvShowNameWithHyphens = $scope.tvShow.name
    .replace(/ /g, '-') // Replace spaces with hyphens
    .toLowerCase();     // Convert to lowercase

  var newUrl =
    "tvshow.html?id=" +
    tvId +
    "-" +
    seasonNumber +
    "-" +
    episodeNumber +
    "/" +
    tvShowNameWithHyphens;

  $window.location.href = newUrl;
};


          function getParameterByName(name) {
            var url = $window.location.href;
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
              results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return "";
            return decodeURIComponent(results[2].replace(/\+/g, " "));
          }
        });
