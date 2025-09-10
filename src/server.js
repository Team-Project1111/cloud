import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import flash from 'connect-flash';
import methodOverride from 'method-override';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Settings
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(
	session({
 		secret: process.env.SESSION_SECRET || 'devsecret',
 		resave: false,
 		saveUninitialized: false,
 		cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }
 	})
);
app.use(flash());

// Static
app.use('/static', express.static(path.join(__dirname, 'public')));

// Globals for views
app.use((req, res, next) => {
	res.locals.flashSuccess = req.flash('success');
	res.locals.flashError = req.flash('error');
	res.locals.currentUser = req.session.user || null;
	next();
});

// Basic routes (will expand)
app.get('/', (req, res) => {
	res.render('home', { title: 'Resource Library' });
});

// 404 handler
app.use((req, res) => {
	res.status(404).render('404', { title: 'Not Found' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});

