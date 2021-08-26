const express = require('express');
const app = express();

const AuthRouter = require('./routes/AuthRouter');
const UserRouter = require('./routes/UserRouter');
const GroupRouter = require('./routes/GroupRouter');
const ReportRouter = require('./routes/ReportRouter');

const AuthBackofficeRouter = require('./routes/Backoffice/AuthRouter');
const GroupBackofficeRouter = require('./routes/Backoffice/GroupRouter');

const AuthWebRouter = require('./routes/Web/AuthRouter');
const UserWebRouter = require('./routes/Web/UserRouter');
const DomainWebRouter = require('./routes/Web/DomainRouter');
const PlaceWebRouter = require('./routes/Web/PlaceRouter');
const StatsWebRouter = require('./routes/Web/StatsRouter');
const AlertWebRouter = require('./routes/Web/AlertRouter');
const GroupWebRouter = require('./routes/Web/GroupRouter');

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


app.set('port', process.env.PORT || 3001);
app.use(express.json());

app.use('/api/auth', AuthRouter);
app.use('/api/user', UserRouter);
app.use('/api/group', GroupRouter);
app.use('/api/report', ReportRouter);

app.use('/api/backoffice/auth', AuthBackofficeRouter);
app.use('/api/backoffice/group', GroupBackofficeRouter);

app.use('/api/web/auth', AuthWebRouter);
app.use('/api/web/user', UserWebRouter);
app.use('/api/web/domain', DomainWebRouter);
app.use('/api/web/place', PlaceWebRouter);
app.use('/api/web/stats', StatsWebRouter);
app.use('/api/web/alert', AlertWebRouter);
app.use('/api/web/group', GroupWebRouter);

app.use('/', (req, res) => {
    res.status(404).send({
        message: "Nenhuma rota encontrada!"
    });
});


app.listen(app.get('port'), () => {
    console.log("Servidor á escuta na porta " + app.get('port'));
});