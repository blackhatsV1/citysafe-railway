
const express = require('express');
const app = express();
const session = require('express-session');

const bodyparser = require('body-parser');
const db = require('./db');


const path = require("path");
require("dotenv").config();

const PORT = process.env.PORT || 9000;


app.use(session({
  secret: 'capstone',
  resave: false,
  saveUninitialized: true
}));


app.set('view engine', 'ejs');
app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('views', './views'); 


//weather
app.get('/weather', (req, res) => {
  if (req.session.loggedin && req.session.role === 'user') {
    db.query('SELECT * FROM requests ORDER BY created_at DESC', (err, results) => {
      if (err) throw err;
      res.render('pages/weather', { users: results, username: req.session.username, apiKey: process.env.OWM_API_KEY });
    });    
  } else {
    res.redirect('/visitor');
  }
});


// index
app.get('/', (req, res) => {
  if (req.session.loggedin && req.session.role === 'user') {
    db.query('SELECT * FROM requests ORDER BY created_at DESC', (err, results) => {
      if (err) throw err;
      res.render('pages/index', { users: results, username: req.session.username, apiKey: process.env.OWM_API_KEY });
    });    
  } else {
    res.redirect('/visitor');
  }
});

// about user
app.get('/aboutuser', (req, res) => {
  if (req.session.loggedin && req.session.role === 'user') {
    db.query('SELECT * FROM users', (err, results) => {
      if (err) throw err;
      res.render('pages/aboutuser', { users: results, username: req.session.username });
    });
  } else {
    res.redirect('/login');
  }
});

app.get('/survival-tips', (req, res) => {
  if (req.session.loggedin && req.session.role === 'user') {
    db.query('SELECT * FROM users', (err, results) => {
      if (err) throw err;
      res.render('pages/survival-tips', { users: results, username: req.session.username });
    });
  } else {
    res.redirect('/login');
  }
});


// SOS
app.get('/send-sos', (req, res) => {
  if (req.session.loggedin && req.session.role === 'user') {
    db.query('SELECT * FROM users', (err, results) => {
      if (err) throw err;
      res.render('pages/sos', { users: results, username: req.session.username });
    });
  } else {
    res.redirect('/login');
  }
});

app.post('/report', (req, res) => {
  if (req.session.loggedin && req.session.role === 'user') {
    const userId = req.session.userId;
    const { disaster_type, location } = req.body;

    const sql = `INSERT INTO disaster_reports (user_id, disaster_type, location) VALUES (?, ?, ?)`;
    db.query(sql, [userId, disaster_type, location], (err, result) => {
      if (err) throw err;
      res.send(`<script>alert('Disaster Reported Successfully!'); window.location.href='/sos-otw';</script>`);
    });
  } else {
    res.redirect('/login');
  }
});

app.get('/sos-otw', (req, res) => {
  if (req.session.loggedin && req.session.role === 'user') {
    db.query('SELECT * FROM users', (err, results) => {
      if (err) throw err;
      res.render('pages/sos-otw', { users: results, username: req.session.username });
    });
  } else {
    res.redirect('/login');
  }
});

// ********************************************************* test *** nearby stations ********************************************
//NEARBY LOCS
app.get('/nearby-stations', (req, res) => {
  if (req.session.loggedin && req.session.role === 'user') {
    db.query('SELECT * FROM users', (err, results) => {
      if (err) throw err;
      res.render('pages/nearby-stations', { users: results, username: req.session.username });
    });
  } else {
    res.redirect('/login');
  }
});

//SCAN DATABASE HARDCODED LOCS
app.post('/nearby-stations', (req, res) => {
  if (req.session.loggedin && req.session.role === 'user') {
    const { lat, lng } = req.body; 
    console.log("Received lat/lng:", lat, lng);

    const radius = 11200; 

    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude are required.' });
    }

    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);
    if (isNaN(latNum) || isNaN(lngNum)) {
      return res.status(400).json({ error: 'Invalid latitude or longitude.' });
    }

    const sql = `
      SELECT name, type, address, latitude, longitude, (
        6371 * acos(
          cos(radians(?)) *
          cos(radians(latitude)) *
          cos(radians(longitude) - radians(?)) +
          sin(radians(?)) *
          sin(radians(latitude))
        )
      ) AS distance
      FROM stations
      HAVING distance < ?
      ORDER BY distance
    `;

    db.query(sql, [latNum, lngNum, latNum, radius], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error' });
      }
      console.log('Stations found:', results);
      res.json(results); 
    });
  } else {
    res.redirect('/login');
  }
});




// requesthelp
app.get('/requesthelp', (req, res) => {
  if (req.session.loggedin && req.session.role === 'user') {
    db.query('SELECT * FROM users', (err, results) => {
      if (err) throw err;
      res.render('pages/requesthelp', { users: results, username: req.session.username });
    });
  } else {
    res.redirect('/login');
  }
});


app.post('/postrequest', (req, res) => {
  if (req.session.loggedin && req.session.role === 'user') {
    const userId = req.session.userId;
    const { name, location, needs } = req.body;

    const sql = `INSERT INTO requests (user_id, name, location, needs) VALUES (?, ?, ?, ?)`;
    db.query(sql, [userId, name, location, needs], (err, result) => {
      if (err) throw err;
      res.send(`<script>alert('Request Posted Successfully!'); window.location.href='/';</script>`);
    });
  } else {
    res.redirect('/login');
  }
});

// send help
app.post('/sendhelp', (req, res) => {
  const id = req.body.id;

  const sql = 'UPDATE requests SET help_count = help_count + 1 WHERE id = ?';

  db.query(sql, [id], (err) => {
      if (err) throw err;
      res.send(`<script>window.location.href='/';alert('Help sent successfully!');</script>`);
  });
});



// edit own account
app.get('/editaccount', (req, res) => {
  if (req.session.loggedin && req.session.role === 'user') {
    const userId = req.session.userId;

    db.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
      if (err) throw err;
      if (results.length > 0) {
        res.render('pages/editprofile', { user: results[0], username: req.session.username });
      } else {
        res.send(`<script>alert('Not Found user!');</script>`);
      }
    });
  } else {
    res.redirect('/login');
  }
});
// update profile 
app.post('/update-account', (req, res) => {
  if (req.session.loggedin && req.session.role === 'user') {
    const userId = req.session.userId;
    const { firstname, lastname, street_address, barangay, city, province, postal_code, country, email, contact_number, landmark, address_type, additional_instructions, password} = req.body;
    db.query('UPDATE users SET firstname = ?, lastname = ?, street_address = ?, barangay = ?, city = ?, province = ?, postal_code = ?, country = ?, email = ?,contact_number = ?, landmark = ?, address_type = ?, additional_instructions = ?, password = ? WHERE id = ?', [firstname, lastname, street_address, barangay, city, province, postal_code, country, email, contact_number, landmark, address_type, additional_instructions, password, userId], (err) => {
      if (err) throw err;
      res.redirect('/');
    });
  } else {
    res.redirect('/login')
  }
});

app.get('/help-user', (req, res) => {
  if (req.session.loggedin && req.session.role === 'user') {
    db.query('SELECT * FROM users', (err, results) => {
      if (err) throw err;
      res.render('pages/weather', { users: results, username: req.session.username });
    });
  } else {
    res.redirect('/login');
  }
});


// ********************************* visitor ******************************************
app.get('/visitor', (req, res) => {
  res.render('pages/visitor', { apiKey: process.env.OWM_API_KEY })
});

app.get('/about', (req, res) => {
  res.render('pages/about')
});

app.get('/services', (req, res) => {
  res.render('pages/services')
});

app.get('/contact', (req, res) => {
  res.render('pages/contact')
});

app.get('/help', (req, res) => {
  res.render('pages/help')
});

app.get('/login', (req, res) => {
  res.render('pages/login')
});

app.get('/register', (req, res) => {
  res.render('pages/signup')
});

// **************************************** visitor end **********************************

// *************************************** login process **********************************
app.post('/login', (req, res) => {
  const { firstname, lastname, password } = req.body;

  db.query('SELECT * FROM users WHERE firstname = ? AND lastname = ? AND password = ?', [firstname, lastname, password], (err, results) => {
    if (err) throw err;

    if (results.length > 0) {
      req.session.loggedin = true;
      req.session.username = results[0].firstname + ' ' + results[0].lastname;
      req.session.role = results[0].role;
      req.session.userId = results[0].id;

      if (results[0].role === 'admin') {
        res.redirect('/adminpage');
      } else {
        res.redirect('/weather');
      }
    } else {
      res.send(`<script>window.location.href='/login'; alert('Wrong Password or Username!');</script>`);
    }
  });
});

// *************************************** login end **********************************



//**************************************** register processs *********************************
app.post('/register', (req, res) => {
  const { firstname, lastname, contact_number, password} = req.body;
  db.query('INSERT INTO users (firstname, lastname, contact_number, password) VALUES (?, ?, ?, ?)', [firstname, lastname, contact_number, password], (err) => {
    if (err) throw err;
    res.send(`<script>window.location.href='/login'; alert('Registered Successfully! Please Login.');</script>`);

  });
});
// ****************************************register end ********************************************




// ************************* for admin ************************************

app.get('/adminpage', (req, res) => {
  if (req.session.loggedin && req.session.role === 'admin') {
    //post per day
    db.query(`
      SELECT 
        DAYNAME(created_at) AS day,
        COUNT(*) AS total
      FROM users
      GROUP BY day
      ORDER BY FIELD(day, 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday')
    `, (err, chartData) => {
      if (err) throw err;
      
      //risk level chart
      const riskLevelQuery = `
        SELECT risk_level, COUNT(*) AS total
        FROM risk_assessments
        GROUP BY risk_level;
      `;
      db.query(riskLevelQuery, (err, riskResults) => {
        if (err) throw err;

        //checklist completed chart
        const checklistQuery = `
          SELECT
            SUM(near_river = 1) AS near_river,
            SUM(near_fault = 1) AS near_fault,
            SUM(has_emergency_kit = 1) AS has_emergency_kit,
            SUM(has_evacuation_plan = 1) AS has_evacuation_plan
          FROM risk_assessments;
        `;
        db.query(checklistQuery, (err, checklistResults) => {
          if (err) throw err;

          //trend graph
          const trendQuery = `
            SELECT DATE(assessed_at) AS date, AVG(risk_score) AS avg_score
            FROM risk_assessments
            GROUP BY DATE(assessed_at)
            ORDER BY date ASC;
          `;
          db.query(trendQuery, (err, trendResults) => {
            if (err) throw err;
            
            //hazards chart
            const hazardsQuery = `
              SELECT 
                SUM(near_river = 1) AS near_river,
                SUM(near_fault = 1) AS near_fault
              FROM risk_assessments;
            `;
            db.query(hazardsQuery, (err, hazardsResults) => {
              if (err) throw err;

              //high, noderate, low risk
              const highRiskQuery = `
                SELECT CONCAT(users.firstname, ' ', users.lastname) AS username, ra.risk_level, ra.risk_score, ra.assessed_at
                FROM risk_assessments ra
                JOIN users ON users.id = ra.user_id
                WHERE ra.risk_level = 'High'
                ORDER BY ra.assessed_at DESC;
              `;
              const moderateRiskQuery = `
                SELECT CONCAT(users.firstname, ' ', users.lastname) AS username, ra.risk_level, ra.risk_score, ra.assessed_at
                FROM risk_assessments ra
                JOIN users ON users.id = ra.user_id
                WHERE ra.risk_level = 'Moderate'
                ORDER BY ra.assessed_at DESC;
              `;
              const lowRiskQuery = `
                SELECT CONCAT(users.firstname, ' ', users.lastname) AS username, ra.risk_level, ra.risk_score, ra.assessed_at
                FROM risk_assessments ra
                JOIN users ON users.id = ra.user_id
                WHERE ra.risk_level = 'Low'
                ORDER BY ra.assessed_at DESC;
              `;

              db.query(highRiskQuery, (err, highRiskUsers) => {
                if (err) throw err;
                db.query(moderateRiskQuery, (err, moderateRiskUsers) => {
                  if (err) throw err;
                  db.query(lowRiskQuery, (err, lowRiskUsers) => {
                    if (err) throw err;

                    const riskTables = {
                      High: highRiskUsers,
                      Moderate: moderateRiskUsers,
                      Low: lowRiskUsers
                    };

                    //user list
                    db.query('SELECT * FROM users', (err, results) => {
                      if (err) throw err;

                      db.query('SELECT count(*) as totalusers FROM users', (err, totaluserresults) => {
                        if (err) throw err;
                        
                        const totalUsers = totaluserresults[0].totalusers;

                        db.query('SELECT count(*) as totalrequests FROM requests', (err, totalrequestsresults) => {
                          if (err) throw err;

                          const totalRequests = totalrequestsresults[0].totalrequests;
                          
                          res.render('pages/adminpage', {
                            chartData,
                            username: req.session.username,
                            riskLevelData: riskResults,
                            checklistData: checklistResults[0],
                            trendData: trendResults,
                            hazardsData: hazardsResults[0],
                            users: results,
                            riskTables,
                            totalUsers,
                            totalRequests
                          })
                        })
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  } else {
    res.redirect('/login');
  }
});


app.get('/userslist', (req, res) => {
  if (req.session.loggedin && req.session.role === 'admin') {
    db.query('SELECT * FROM users', (err, results) => {
      if (err) throw err;
      res.render('pages/userslist', { users: results, username: req.session.username });
    });
  } else {
    res.redirect('/login')
  }

});

app.get('/addusers', (req, res) => {
  if (req.session.loggedin && req.session.role === 'admin') {
    db.query('SELECT * FROM users', (err, results) => {
      if (err) throw err;
      res.render('pages/addusers', { users: results, username: req.session.username });
    });
  } else {
    res.redirect('/login');
  }
});

// add user
app.post('/add', (req, res) => {
  if (req.session.loggedin && req.session.role === 'admin') {
    const { firstname, lastname, street_address,
      barangay, city, province, postal_code,
      country, email, contact_number, landmark,
      address_type, additional_instructions, password, role } = req.body;
    db.query('INSERT INTO users (firstname, lastname, street_address, barangay, city, province, postal_code, country, email, contact_number, landmark, address_type, additional_instructions, password, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [firstname, lastname, street_address, barangay, city, province, postal_code, country, email, contact_number, landmark, address_type, additional_instructions, password, role], (err) => {
      if (err) throw err;
      res.redirect('/adminpage');
    });
  } else {
    res.redirect('/login')
  }

});

// DELETE user
app.post('/delete/:id', (req, res) => {
  if (req.session.loggedin && req.session.role === 'admin') {
    const userId = req.params.id;
    db.query('DELETE FROM users WHERE id = ?', [userId], (err) => {
      if (err) throw err;
      res.redirect('/adminpage');
    });
  } else {
    res.redirect('/login')
  }

});


// edit form
app.get('/edit/:id', (req, res) => {
  if (req.session.loggedin && req.session.role === 'admin') {
    const userId = req.params.id;
    db.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
      if (err) throw err;
      res.render('pages/edit', { user: results[0], username: req.session.username });
    });
  } else {
    res.redirect('/login')
  }

});

// Update user
app.post('/update/:id', (req, res) => {
  if (req.session.loggedin && req.session.role === 'admin') {
    const userId = req.params.id;
    const { firstname, lastname, street_address, barangay, city, province, postal_code, country, email, contact_number, landmark, address_type, additional_instructions, password, role } = req.body;
    db.query('UPDATE users SET firstname = ?, lastname = ?, street_address = ?, barangay = ?, city = ?, province = ?, postal_code = ?, country = ?, email = ?,contact_number = ?, landmark = ?, address_type = ?, additional_instructions = ?, password = ?, role = ? WHERE id = ?', [firstname, lastname, street_address, barangay, city, province, postal_code, country, email, contact_number, landmark, address_type, additional_instructions, password, role, userId], (err) => {
      if (err) throw err;
      res.redirect('/userslist');
    });
  } else {
    res.redirect('/login')
  }
});

app.get('/aboutadmin', (req, res) => {
  if (req.session.loggedin && req.session.role === 'admin') {
    db.query('SELECT * FROM users', (err, results) => {
      if (err) throw err;
      res.render('pages/aboutadmin', { users: results, username: req.session.username });
    });
  } else {
    res.redirect('/login');
  }
});

// reports
app.get('/reports', (req, res) => {
  if (req.session.loggedin && req.session.role === 'admin') {
    //post per day
    db.query(`
      SELECT 
        DAYNAME(created_at) AS day,
        COUNT(*) AS total
      FROM users
      GROUP BY day
      ORDER BY FIELD(day, 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday')
    `, (err, chartData) => {
      if (err) throw err;
      
      //risk level chart
      const riskLevelQuery = `
        SELECT risk_level, COUNT(*) AS total
        FROM risk_assessments
        GROUP BY risk_level;
      `;
      db.query(riskLevelQuery, (err, riskResults) => {
        if (err) throw err;

        //checklist completed chart
        const checklistQuery = `
          SELECT
            SUM(near_river = 1) AS near_river,
            SUM(near_fault = 1) AS near_fault,
            SUM(has_emergency_kit = 1) AS has_emergency_kit,
            SUM(has_evacuation_plan = 1) AS has_evacuation_plan
          FROM risk_assessments;
        `;
        db.query(checklistQuery, (err, checklistResults) => {
          if (err) throw err;

          //trend graph
          const trendQuery = `
            SELECT DATE(assessed_at) AS date, AVG(risk_score) AS avg_score
            FROM risk_assessments
            GROUP BY DATE(assessed_at)
            ORDER BY date ASC;
          `;
          db.query(trendQuery, (err, trendResults) => {
            if (err) throw err;
            
            //hazards chart
            const hazardsQuery = `
              SELECT 
                SUM(near_river = 1) AS near_river,
                SUM(near_fault = 1) AS near_fault
              FROM risk_assessments;
            `;
            db.query(hazardsQuery, (err, hazardsResults) => {
              if (err) throw err;

              //high, noderate, low risk
              const highRiskQuery = `
                SELECT CONCAT(users.firstname, ' ', users.lastname) AS username, ra.risk_level, ra.risk_score, ra.assessed_at
                FROM risk_assessments ra
                JOIN users ON users.id = ra.user_id
                WHERE ra.risk_level = 'High';
              `;
              const moderateRiskQuery = `
                SELECT CONCAT(users.firstname, ' ', users.lastname) AS username, ra.risk_level, ra.risk_score, ra.assessed_at
                FROM risk_assessments ra
                JOIN users ON users.id = ra.user_id
                WHERE ra.risk_level = 'Moderate';
              `;
              const lowRiskQuery = `
                SELECT CONCAT(users.firstname, ' ', users.lastname) AS username, ra.risk_level, ra.risk_score, ra.assessed_at
                FROM risk_assessments ra
                JOIN users ON users.id = ra.user_id
                WHERE ra.risk_level = 'Low';
              `;

              db.query(highRiskQuery, (err, highRiskUsers) => {
                if (err) throw err;
                db.query(moderateRiskQuery, (err, moderateRiskUsers) => {
                  if (err) throw err;
                  db.query(lowRiskQuery, (err, lowRiskUsers) => {
                    if (err) throw err;

                    const riskTables = {
                      High: highRiskUsers,
                      Moderate: moderateRiskUsers,
                      Low: lowRiskUsers
                    };

                    //user list
                    db.query('SELECT * FROM users', (err, results) => {
                      if (err) throw err;

                      res.render('pages/reports', {
                        chartData,
                        username: req.session.username,
                        riskLevelData: riskResults,
                        checklistData: checklistResults[0],
                        trendData: trendResults,
                        hazardsData: hazardsResults[0],
                        users: results,
                        riskTables
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  } else {
    res.redirect('/login');
  }
});

app.get('/assessment-results', (req, res) => {
  if (req.session.loggedin && req.session.role === 'admin') {
    const userId = req.session.userId;
    db.query(`SELECT 
        risk_assessments.*, 
        users.firstname, 
        users.lastname 
      FROM 
        risk_assessments 
      JOIN 
        users ON risk_assessments.user_id = users.id 
      ORDER BY 
        risk_assessments.assessed_at DESC`, (err, results) => {
      if (err) throw err;
      res.render('pages/assessment-results-admin', { assessments: results, username: req.session.username });
    });
  } else {
    res.redirect('/login');
  }
});


//view all posts
app.get('/view-users-posts', (req, res) => {
  if (req.session.loggedin && req.session.role === 'admin') {
    db.query('SELECT * FROM requests ORDER BY created_at DESC', (err, results) => {
      if (err) throw err;
      res.render('pages/view-users-posts', { users: results, username: req.session.username });
    });
  } else {
    res.redirect('/login')
  }

});

//sos reports result
app.get('/disaster-reports', (req, res) => {
  if (req.session.loggedin && req.session.role === 'admin') {
    const disasterReportsQuery = `
      SELECT 
        CONCAT(users.firstname, ' ', users.lastname) AS sender,
        dr.disaster_type,
        dr.location,
        dr.reported_at
      FROM disaster_reports dr
      JOIN users ON users.id = dr.user_id
      ORDER BY dr.reported_at DESC;
    `;

    db.query(disasterReportsQuery, (err, reports) => {
      if (err) throw err;
      res.render('pages/disaster-reports', { reports , username: req.session.username});
    });
  } else {
    res.redirect('/login');
  }
});


// ************************************ end for admin **************************************************************

// *****************************************assess risk *****************************************************
app.get('/risk-results', (req, res) => {
  if (req.session.loggedin && req.session.role === 'user') {
    const userId = req.session.userId;
    db.query('SELECT * FROM risk_assessments WHERE user_id = ? ORDER BY assessed_at DESC', [userId], (err, results) => {
      if (err) throw err;
      res.render('pages/riskassessmentresult', { assessments: results, username: req.session.username });
    });
  } else {
    res.redirect('/login');
  }
});

app.get('/assess-risk', (req, res) => {
  if (req.session.loggedin && req.session.role === 'user') {
      res.render('pages/riskassessment', {username: req.session.username });
  } else {
    res.redirect('/login');
  }
});

app.post('/assess-risk', (req, res) => {
  const { nearRiver, nearFault, hasKit, hasPlan } = req.body;
  const userId = req.session.userId;

  let score = 0;
  if (nearRiver === 'true') score += 3;
  if (nearFault === 'true') score += 3;
  if (hasKit === 'false') score += 2;
  if (hasPlan === 'false') score += 2;

  let level = 'Low';
  if (score >= 5 && score <= 7) level = 'Moderate';
  else if (score >= 8) level = 'High';

  const query = `
    INSERT INTO risk_assessments 
    (user_id, near_river, near_fault, has_emergency_kit, has_evacuation_plan, risk_score, risk_level) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    userId,
    nearRiver === 'true',
    nearFault === 'true',
    hasKit === 'true',
    hasPlan === 'true',
    score,
    level
  ];

  db.query(query, values, (err) => {
    if (err) throw err;
    res.redirect('/risk-results');
  });
});

app.post('/delete-result/:id', (req, res) => {
  const assessmentId = req.params.id;
  const userId = req.session.userId;

  const sql = 'DELETE FROM risk_assessments WHERE id = ? AND user_id = ?';
  db.query(sql, [assessmentId, userId], (err) => {
    if (err) throw err;
    res.redirect('/risk-results');
  });
});
//**************************************** end of assessment tool *************************************


app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/visitor');
    }
  });
});

app.listen(PORT, () => {
  console.log(`Running at http://localhost:${PORT}`);
})