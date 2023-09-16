angular
        .module("mtApp", [])
        .controller("mtController", function ($scope, $http, $window) {
          var apiKey = "a79576e54c5bbb893011b98ca48f2460";
          var tvIdSeasonEpisode = getParameterByName("id");
          var tvIdParts = tvIdSeasonEpisode.split("-");
          var tvId = tvIdParts[0];
          var seasonNumber = parseInt(tvIdParts[1]);
          var episodeNumber = parseInt(tvIdParts[2]);

           // Variabel untuk menyimpan daftar musim TV
          $scope.seasons = []; 
           // Variabel untuk menyimpan daftar episode
          $scope.episodes = [];
          

if (!isNaN(seasonNumber) && !isNaN(episodeNumber)) {
            var episodeUrl =
              "https://api.themoviedb.org/3/tv/" +
              tvId +
              "/season/" +
              seasonNumber +
              "/episode/" +
              episodeNumber +
              "?language=en-US&api_key=" +
              apiKey;


            // Mendapatkan informasi seri TV dari API
            var tvSeriesUrl =
  "https://api.themoviedb.org/3/tv/" +
  tvId +
  "?language=en-US&api_key=" +
  apiKey;


            // Lakukan permintaan HTTP untuk mendapatkan informasi seri TV
            $http.get(tvSeriesUrl).then(
              function (tvSeriesResponse) {
                // Tampilkan informasi seri TV di kartu
                $scope.tvSeriesTitle = tvSeriesResponse.data.name;
                $scope.tvSeriesStatus = tvSeriesResponse.data.status;
                $scope.tvSeriesBackdrop = tvSeriesResponse.data.backdrop_path;
                $scope.tvSeriesType = tvSeriesResponse.data.type;
                $scope.tvSeriesVoteAverage = tvSeriesResponse.data.vote_average.toFixed(1);
                $scope.tvSeriesFirstAirDate = tvSeriesResponse.data.first_air_date;
                $scope.tvSeriesLastAirDate = tvSeriesResponse.data.last_air_date;
                $scope.tvSeriesNumEpisode = tvSeriesResponse.data.number_of_episodes;
                $scope.tvSeriesNumSeason = tvSeriesResponse.data.number_of_seasons;
                $scope.tvSeriesGenre = tvSeriesResponse.data.genres
                  .map(function (genre) {
                    return genre.name;
                  })
                  .join(", ");
                $scope.tvSeriesCompanies =
                  tvSeriesResponse.data.production_companies
                    .map(function (production_companies) {
                      return production_companies.name;
                    })
                    .join(", ");
                $scope.tvSeriesTagline = tvSeriesResponse.data.tagline;
                $scope.tvSeriesnetwork = tvSeriesResponse.data.networks
                  .map(function (networks) {
                    return networks.name;
                  })
                  .join(", ");
                  $scope.tvSeriesCountry = tvSeriesResponse.data.production_countries.map(function (production_countries) {
                    return production_countries.name;
                  })
                  .join(", ");
                  $scope.tvSeriesCreator = tvSeriesResponse.data.created_by
  .map(function (creator) {
    return creator.name;
  })
  .join(", ");

  // Menampilkan Pemain
  var tvSeriesUrl =
  "https://api.themoviedb.org/3/tv/" +
  tvId +
  "/credits?language=en-US&api_key=" +
  apiKey;

$http.get(tvSeriesUrl).then(
  function (response) {
    // Periksa apakah 'cast' ada dalam respons
    if (response.data && response.data.cast) {
      // Data yang Anda terima adalah objek JSON dengan informasi pemain (cast) TV series
      $scope.cast = response.data.cast;
    } else {
      // 'cast' tidak ada dalam respons, berikan pesan kesalahan atau tangani secara tepat
      console.error('n/a.');
    }
  }
)

 // Mendapatkan informasi certification TV dari API
          var tvCertificationUrl =
            "https://api.themoviedb.org/3/tv/" +
            tvId +
            "?append_to_response=content_ratings&language=en-US&api_key=" +
            apiKey;

          // Lakukan permintaan HTTP untuk mendapatkan informasi certification TV
          $http.get(tvCertificationUrl).then(
            function (certificationResponse) {
              // Tampilkan certification TV di halaman
              if (
                certificationResponse.data &&
                certificationResponse.data.content_ratings &&
                certificationResponse.data.content_ratings.results
              ) {
                var contentRatings = certificationResponse.data.content_ratings.results;
                var tvCertifications = contentRatings.filter(function (rating) {
                  return rating.iso_3166_1 === "US"; // Ubah sesuai dengan kode negara yang Anda butuhkan
                });

                if (tvCertifications.length > 0) {
                  $scope.tvSeriesCertification = tvCertifications[0].rating;
                } else {
                  $scope.tvSeriesCertification = "n/a"; // Atur pesan default jika tidak ada certification TV yang tersedia
                }
              } else {
                $scope.tvSeriesCertification = "n/a"; // Atur pesan default jika tidak ada data certification TV
              }
            },
            function (error) {
              console.error("Error fetching TV certification:", error);
            }
          );

              },
              function (error) {
                console.error("Error fetching TV series detail:", error);
              }
            );

            // Mendapatkan informasi dari Season TV dari API
            var tvSeasonUrl =
              "https://api.themoviedb.org/3/tv/" +
              tvId +
              "/season/" +
              seasonNumber +
              "?language=en-US&api_key=" +
              apiKey;

            // Lakukan permintaan HTTP untuk mendapatkan informasi musim TV
            $http.get(tvSeasonUrl).then(
              function (tvSeasonResponse) {
                // Tampilkan poster musim TV di halaman
                $scope.tvSeasonPosterPath = tvSeasonResponse.data.poster_path;
                $scope.tvSeasonAirDate = tvSeasonResponse.data.air_date;
                $scope.tvSeasonNumEpisodes = tvSeasonResponse.data.episodes.length;
              },
              function (error) {
                console.error("Error fetching TV season detail:", error);
              }
            );

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
                        { title: "Tidak ada hasil yang ditemukan" },
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

             // MENAMPILKAN SEASON LIST TV
            var seasonsUrl =
              "https://api.themoviedb.org/3/tv/" +
              tvId +
              "?append_to_response=seasons&language=en-US&api_key=" +
              apiKey;
            $http.get(seasonsUrl).then(
              function (seasonsResponse) {
                // Periksa apakah 'seasons' ada dalam respons
                if (seasonsResponse.data && seasonsResponse.data.seasons) {
                  // Data yang Anda terima adalah daftar musim TV
                  $scope.seasons = seasonsResponse.data.seasons;
                } else {
                  // 'seasons' tidak ada dalam respons, berikan pesan kesalahan atau tangani secara tepat
                  console.error('season n/a.');
                }
              },
              function (error) {
                console.error("Error fetching TV seasons:", error);
              }
            );
             // MENAMPILKAN SEASON LIST TV END

              // MENAMPILKAN EPISODE LIST TV
            var episodesUrl =
              "https://api.themoviedb.org/3/tv/" +
              tvId +
              "/season/" +
              seasonNumber +
              "?language=en-US&api_key=" +
              apiKey;

          
            $http.get(episodesUrl).then(
              function (episodesResponse) {
               
                if (episodesResponse.data && episodesResponse.data.episodes) {
                 
                  $scope.episodes = episodesResponse.data.episodes;
                } else {
                
                  console.error('eps n/a.');
                }
              },
              function (error) {
                console.error("Error fetching TV episodes:", error);
              }
            );
          // MENAMPILKAN EPISODE LIST TV END

            // Fungsi untuk mengarahkan pengguna ke halaman yang sesuai
            $scope.goToMediaDetail = function (media) {
              if ($scope.searchMediaType === "movie") {
                $window.location.href = "movie.html?id=" + media.id;
              } else if ($scope.searchMediaType === "tv") {
                $window.location.href = "tv.html?id=" + media.id;
              }
            };

            $http.get(episodeUrl).then(
              function (episodeResponse) {
                $scope.episode = episodeResponse.data;
              },
              function (error) {
                console.error("Error fetching episode detail:", error);
              }
            );
          } else {
            console.error("Invalid seasonNumber or episodeNumber");
          }

          $scope.getBackdropUrl = function (backdropPath) {
            return backdropPath
              ? "https://image.tmdb.org/t/p/w1280/" + backdropPath
              : "";
          };

           $scope.getStillUrl = function (stillPath) {
            return stillPath
              ? "https://image.tmdb.org/t/p/w1280/" + stillPath
              : "";
          };

          $scope.getPosterUrl = function (posterPath) {
            return posterPath
              ? "https://image.tmdb.org/t/p/w300/" + posterPath
              : "";
          };

         function getParameterByName(name) {
  var url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
  var results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// Format date
$scope.formatDate = function (inputDate) {
  if (inputDate) {
    var parts = inputDate.split("-");
    var dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
    var monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    var monthName = monthNames[dateObj.getMonth()];
    var day = dateObj.getDate();
    var year = dateObj.getFullYear();
    var formattedDate = monthName + " " + day + ", " + year;
    return formattedDate;
  } else {
    return "Date not available";
  }
};


// Fungsi untuk memperbarui URL parameter SEASON yang dipilih
$scope.updateSeasonParameter = function (selectedSeason) {
  if (selectedSeason && selectedSeason.season_number) {
    var tvIdSeasonEpisode = getParameterByName("id");
    var tvIdParts = tvIdSeasonEpisode.split("-");
    var tvId = tvIdParts[0];
    var episodeNumber = parseInt(tvIdParts[2]);
    var tvShowName = $scope.tvSeriesTitle.replace(/ /g, "-");
    var updatedUrl = `/p/tvshow.html?id=${tvId}-${selectedSeason.season_number}-${episodeNumber}/${tvShowName}`;
    $window.location.href = updatedUrl;
  } else {
    console.error("Season or season_number is not available.");
  }
};

// Fungsi untuk memperbarui URL parameter EPISODE yang dipilih
$scope.updateEpisodeParameter = function (selectedEpisode) {
  var episodeNumber = selectedEpisode.episode_number;
  var tvShowName = $scope.tvSeriesTitle.replace(/ /g, "-"); // 
  var updatedUrl = `/p/tvshow.html?id=${tvId}-${seasonNumber}-${episodeNumber}/${tvShowName}`;
  $window.location.href = updatedUrl;
};

// Fungsi untuk memperbarui URL parameter episode
function updateUrlParameter(key, value) {
  var url = $window.location.href;
  var regex = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
  var separator = url.indexOf("?") !== -1 ? "&" : "?";
  if (url.match(regex)) {
    return url.replace(regex, "$1" + key + "=" + value + "$2");
  } else {
    return url + separator + key + "=" + value;
  }
}
});
