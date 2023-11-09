var app = angular.module('QuranApp', []);

app.controller('QuranController', function ($scope, $http) {
    $scope.hadithData = {}; // Simpan data hadis di sini
    $scope.currentPage = 1; // Inisialisasi currentPage di dalam $scope
    var limit = 13;
    var pagesLimit = 10;
    $scope.loading = true;
    $scope.preBismillah = {
        audio: {
            primary1: 'https://cdn.alquran.cloud/media/audio/ayah/ar.alafasy/1' // Ganti URL dengan URL audio yang tepat
        }
    };
    let currentAudio = null;
    $scope.tafsirData = {};
    $scope.selectedAyat = {}; 
    $scope.selectedNoAyat = {};

    function loadHadithData(page) {
        $http.get(`https://hadis-api-id.vercel.app/hadith/${tokoh}/?page=${page}&limit=${limit}`)
            .then(function (response) {
                $scope.hadithData = response.data; // Memasukkan data ke dalam $scope
                $scope.currentPage = page; // Menggunakan $scope.currentPage
            }, function (error) {
                console.error('Gagal mengambil data:', error);
            });
    }

    loadHadithData($scope.currentPage); // Menggunakan $scope.currentPage
    loadQuranData(); // Untuk memuat data Al-Quran

    $scope.loadPage = function (page) {
        if (page >= 1 && page <= $scope.hadithData.pagination.totalPages) {
            loadHadithData(page);
        }
    };

    $scope.getPages = function () {
        if ($scope.hadithData.pagination) {
            $scope.totalPages = $scope.hadithData.pagination.totalPages;
            var start = Math.max(1, $scope.currentPage - Math.floor(pagesLimit / 2));
            var end = Math.min(start + pagesLimit - 1, $scope.totalPages);

            if (end - start + 1 < pagesLimit) {
                start = Math.max(1, end - pagesLimit + 1);
            }

            var pagesArray = [];
            for (var i = start; i <= end; i++) {
                pagesArray.push(i);
            }
            return pagesArray;
        }
    };

    
  var apiUrl = `https://api.quran.gading.dev/surah/${surah_no}`;
  
  $http.get(apiUrl)
    .then(function(response) {
      $scope.preBismillah = response.data.data.preBismillah;
      $scope.tafsirData = response.data.data;

      if ($scope.tafsirData && $scope.tafsirData.verses) {
        $scope.ayatSurah = $scope.tafsirData.verses.map(function(ayat) {
          return {
            nomorAyat: ayat.number && ayat.number.inSurah ? ayat.number.inSurah : 'Data Tidak Tersedia',
            juz: ayat.meta && ayat.meta.juz ? ayat.meta.juz : 'Data Tidak Tersedia',
            teksArab: ayat.text && ayat.text.arab ? ayat.text.arab : 'Data Tidak Tersedia',
            transliterasiInggris: ayat.text && ayat.text.transliteration && ayat.text.transliteration.en ? ayat.text.transliteration.en : 'Data Tidak Tersedia',
            terjemahan: ayat.translation && ayat.translation.id ? ayat.translation.id : 'Data Tidak Tersedia',
            terjemahanEn: ayat.translation && ayat.translation.id ? ayat.translation.en : 'Data Tidak Tersedia',
            audio: ayat.audio && ayat.audio.primary ? ayat.audio.primary : 'Data Tidak Tersedia',
            tafsirSingkat: ayat.tafsir && ayat.tafsir.id && ayat.tafsir.id.short ? ayat.tafsir.id.short : 'Data Tidak Tersedia',
            tafsirPanjang: ayat.tafsir && ayat.tafsir.id && ayat.tafsir.id.long ? ayat.tafsir.id.long : 'Data Tidak Tersedia',
            audioPlayer: null
          };
        });
      }

      if ($scope.tafsirData && $scope.tafsirData.name && $scope.tafsirData.name.transliteration) {
        $scope.judulSurah = {
          namaTransliterasi: $scope.tafsirData.name.transliteration.id,
          surahKe: $scope.formatSurahNumber($scope.tafsirData.number),
          namaArab: $scope.tafsirData.name.short,
          namaTerjemahan: $scope.tafsirData.name.translation.id,
          tipeRevelasi: $scope.tafsirData.revelation.id,
          juz: $scope.tafsirData.verses[0].meta.juz,
          jumlahAyat: $scope.tafsirData.numberOfVerses
        };
      }
    })
    .catch(function(error) {
      console.error('Error fetching data:', error);
    });


// }
//   });

//   $http.get('https://api.quran.gading.dev/surah/')
//     .then(function (response) {
//       $scope.surahList = response.data.data; // Mengisi daftar surah
//     })
//     .catch(function (error) {
//       console.log("Error fetching surah list: " + error);
//     });

    $scope.playAudio = function(data) {
if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0; 
}

if (!data.audioPlayer) {
    data.audioPlayer = new Audio(data.audio.primary ? data.audio.primary : data.audio);
    data.audioPlayer.play();
    currentAudio = data.audioPlayer;
} else {
    if (!data.audioPlayer.paused) {
        data.audioPlayer.pause();
        data.audioPlayer.currentTime = 0; 
    } else {
        data.audioPlayer.play();
        currentAudio = data.audioPlayer;
    }
}
};

 // Fungsi untuk mengubah nomor surah sesuai kebutuhan
$scope.formatSurahNumber = function(number) {
    if (number < 10) {
        return '00' + number;
    } else if (number >= 10 && number < 100) {
        return '0' + number; 
    } else {
        return number; 
    }
};
    
// conver to arabic
$scope.convertToArabic = function(number) {
  // Fungsi untuk mengonversi angka ke angka Arab
  const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  const converted = number.toString().replace(/\d/g, (d) => arabicNumbers[d]);
  return converted;
};

// Variabel untuk menyimpan ayat yang dipilih
$scope.selectedAyat = {}; 
$scope.selectedNoAyat = {};

// Fungsi untuk menampilkan tafsir saat tombol ditekan
$scope.openModal = function(ayat) {
  $scope.selectedAyat = ayat; 
  $scope.selectedNoAyat = ayat.nomorAyat;

};

// Setelah data selesai dimuat, atur loading ke false
$scope.loading = false;
    })
    .catch(function(error) {
      console.error('Error fetching data:', error);
      $scope.loading = false; // Atur loading ke false jika ada kesalahan saat memuat data
    });

   
