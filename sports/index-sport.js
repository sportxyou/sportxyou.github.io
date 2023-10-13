// Mengambil data events dari API pertama
      fetch(
        "https://www.thesportsdb.com/api/v1/json/40130162/eventsday.php?d=2023-10-13"
      )
        .then((response) => response.json()) // Mengubah respons ke JSON
        .then((data) => {
          // Mendapatkan daftar events
          const events = data.events;
          const eventListDiv = document.getElementById("event-list");

          // Melakukan callback chaining untuk setiap event
          events.forEach((event) => {
            // Mengambil idTeam dari setiap event
            const idHomeTeam = event.idHomeTeam;
            const idAwayTeam = event.idAwayTeam;

            // Mengambil data tambahan dari API kedua menggunakan idTeam untuk home team
            fetch(
              `https://www.thesportsdb.com/api/v1/json/40130162/lookupteam.php?id=${idHomeTeam}`
            )
              .then((response) => response.json()) // Mengubah respons ke JSON
              .then((homeTeamData) => {
                // Mengambil strTeamBadge untuk home team
                const homeTeamBadge = homeTeamData.teams[0].strTeamBadge;

                // Mengambil data tambahan dari API kedua menggunakan idTeam untuk away team
                fetch(
                  `https://www.thesportsdb.com/api/v1/json/40130162/lookupteam.php?id=${idAwayTeam}`
                )
                  .then((response) => response.json()) // Mengubah respons ke JSON
                  .then((awayTeamData) => {
                    // Mengambil strTeamBadge untuk away team
                    const awayTeamBadge = awayTeamData.teams[0].strTeamBadge;

                    // Menggabungkan data event dengan data tim
                    const eventWithTeamData = {
                      idEvent: event.idEvent,
                      eventName: event.strEvent,
                      homeTeamBadge: homeTeamBadge,
                      awayTeamBadge: awayTeamBadge,
                      // Tambahkan data lainnya dari response teamData sesuai kebutuhan
                    };

                    // Membuat elemen div untuk menampilkan data event
                    const eventDiv = document.createElement("div");
                    eventDiv.innerHTML = `<strong>Event ID:</strong> ${eventWithTeamData.idEvent}<br>
                                                        <strong>Event Name:</strong> ${eventWithTeamData.eventName}<br>
                                                        <strong>Home Team Badge:</strong> <img src="${eventWithTeamData.homeTeamBadge}" alt="Home Team Badge"><br>
                                                        <strong>Away Team Badge:</strong> <img src="${eventWithTeamData.awayTeamBadge}" alt="Away Team Badge"><br><br>`;

                    // Menambahkan elemen eventDiv ke dalam eventListDiv
                    eventListDiv.appendChild(eventDiv);
                  })
                  .catch((error) => {
                    console.error("Error fetching away team data:", error);
                  });
              })
              .catch((error) => {
                console.error("Error fetching home team data:", error);
              });
          });
        })
        .catch((error) => {
          console.error("Error fetching events:", error);
        });
