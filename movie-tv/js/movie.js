 angular
        .module("mtApp", [])
        .controller("mtController", function ($scope, $http, $window) {
          $scope.getBackdropUrl = function (backdropPath) {
            return backdropPath
              ? "https://image.tmdb.org/t/p/w780/" + backdropPath
              : "";
          };
          var apiKey = "a79576e54c5bbb893011b98ca48f2460";
          var params = getUrlParameters();
          var queryParams = new URLSearchParams(window.location.search);
          var movieParam = queryParams.get("id");

          // Memisahkan ID film dan judul film
          var idAndTitle = movieParam.split("/");
          var movieId = idAndTitle[0];
          var movieTitle = idAndTitle[1];
          var additionalInfo = params.additionalInfo;
          var movieDetailUrl =
            "https://api.themoviedb.org/3/movie/" +
            movieId +
            "?language=en-US&api_key=" +
            apiKey;
          // Mendapatkan informasi sertifikasi film dari API

          var movieCertificationUrl =
            "https://api.themoviedb.org/3/movie/" +
            movieId +
            "/release_dates?api_key=" +
            apiKey;

          $http
            .get(movieCertificationUrl)
            .then(function (response) {
              // Memeriksa apakah respons berhasil
              if (response.status === 200) {
                // Memeriksa apakah properti 'results' ada dalam respons
                if (response.data.results) {
                  // Cari sertifikasi untuk negara "US"
                  var usCertification = response.data.results.find(function (
                    result
                  ) {
                    return result.iso_3166_1 === "US";
                  });

                  // Jika sertifikasi ditemukan, tampilkan rating-nya
                  if (
                    usCertification &&
                    usCertification.release_dates.length > 0
                  ) {
                    $scope.certification =
                      usCertification.release_dates[0].certification;
                  } else {
                    $scope.certification = "-";
                  }
                } else {
                  $scope.certification = "-";
                }
              } else {
                $scope.certification = "-";
              }
            })
            .catch(function (error) {
              $scope.certification = "no data: " + error;
            });

          $http
            .get(movieDetailUrl)
            .then(function (response) {
              $scope.movie = response.data;

              // Mendapatkan data produksi dari respons
              var productionCountries = $scope.movie.production_countries;

              // Menyimpan nama-nama negara dalam variabel $scope.productionCountries
              $scope.productionCountries = productionCountries.map(function (
                country
              ) {
                return country.name;
              });

              // Mendapatkan data perusahaan dari respons
              var productionCompanies = $scope.movie.production_companies;

              // Menyimpan nama-nama perusahaan dalam variabel $scope.productionCompanies
              $scope.productionCompanies = productionCompanies.map(function (
                company
              ) {
                return company.name;
              });
            })
            .catch(function (error) {
              console.error("Error fetching movie detail:", error);
            });

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

          // Fungsi untuk mengarahkan pengguna ke halaman yang sesuai
          $scope.goToMediaDetail = function (media) {
            if ($scope.searchMediaType === "movie") {
              $window.location.href = "p/movie.html?id=" + media.id;
            } else if ($scope.searchMediaType === "tv") {
              $window.location.href = "p/movie.html?id=" + media.id;
            }
          };

          // Mendapatkan data cast dari respons API TMDb

          $http
            .get(
              "https://api.themoviedb.org/3/movie/" +
                movieId +
                "/credits?api_key=" +
                apiKey
            )
            .then(function (response) {
              var credits = response.data;
              $scope.cast = response.data.cast;

              // Pastikan data kru tersedia dalam respons API
              if (credits && credits.crew) {
                $scope.crew = credits.crew;

                // Fungsi untuk mendapatkan nama sutradara dari data kru
                $scope.getDirectorNames = function (crew) {
                  var directors = crew.filter(function (member) {
                    return member.job === "Director";
                  });
                  return directors
                    .map(function (director) {
                      return director.name;
                    })
                    .join(", ");
                };
              } else {
                // Data kru tidak tersedia, beri tahu pengguna
                $scope.crew = [];
                $scope.getDirectorNames = function () {
                  return "Data kru tidak tersedia";
                };
              }
            })
            .catch(function (error) {
              console.error("Error fetching movie cast:", error);
            });

          // Mendapatkan kata kunci dari film
          $http
            .get(
              "https://api.themoviedb.org/3/movie/" +
                movieId +
                "/keywords?api_key=" +
                apiKey
            )
            .then(function (keywordsResponse) {
              // Mendapatkan data kata kunci dari respons
              var keywords = keywordsResponse.data.keywords;

              // Menyimpan kata kunci dalam variabel $scope.keywords
              $scope.keywords = keywords.map(function (keyword) {
                return keyword.name;
              });
            })
            .catch(function (error) {
              console.error("Error fetching movie keywords:", error);
            });

          function getParameterByName(name) {
            var url = $window.location.href;
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
              results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return "";
            return decodeURIComponent(results[2].replace(/\+/g, " "));
          }
          $scope.getBackdropUrl = function (backdropPath) {
            return backdropPath
              ? "https://image.tmdb.org/t/p/w1280/" + backdropPath
              : "";
          };

          $scope.getPosterUrl = function (posterPath) {
            return posterPath
              ? "https://image.tmdb.org/t/p/w300/" + posterPath
              : "";
          };

          // Format date
          $scope.formatDate = function (inputDate) {
            if (typeof inputDate === "string" && inputDate.split) {
              var parts = inputDate.split("-");
              if (parts.length === 3) {
                var dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
                var monthNames = [
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ];
                var monthName = monthNames[dateObj.getMonth()];
                var day = dateObj.getDate();
                var year = dateObj.getFullYear();
                var formattedDate = monthName + " " + day + ", " + year;
                return formattedDate;
              }
            }
            return inputDate; // Kembalikan input asli jika tidak dapat memformat
          };

          // Fungsi untuk mengambil semua parameter dari URL
          function getUrlParameters() {
            var params = {};
            var urlParams = new URLSearchParams(window.location.search);
            urlParams.forEach(function (value, key) {
              params[key] = value;
            });
            return params;
          }

          if (movieId) {
            // Memisahkan ID film dari judul
            var idParts = movieId.split("/"); // Memisahkan berdasarkan tanda hubung (slash)
            var actualMovieId = idParts[0]; // Mengambil ID film yang sesuai

            function loadMovieData(movieId) {
              // Lakukan permintaan HTTP untuk mengambil data film berdasarkan ID
              var movieUrl = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US&api_key=${apiKey}`;

              $http
                .get(movieUrl)
                .then(function (response) {
                  $scope.movie = response.data;
                  $scope.additionalInfo = additionalInfo; // Menetapkan judul dari parameter "judul-movie"
                })
                .catch(function (error) {
                  console.error("Error fetching movie details:", error);
                });
            }
          } else {
            console.error("Movie ID not found in URL");
          }
        });
