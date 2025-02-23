import http from 'http';
import { EventEmitter } from 'events';
import { Tarefa } from './task.js';

let tasks_aguardando = [];
let tasks_trabalhando = [];
let tasks_finalizadas = [];

var task1 = new Tarefa(1, `Armazenar dados`);
var task2 = new Tarefa(2, `Analisar dados`);
var task3 = new Tarefa(3, `Limpar dados`);
var task4 = new Tarefa(4, `Disponibilizar dados`);

task1.setStatus('trabalhando');
task2.setStatus('aguardando');
task3.setStatus('aguardando');
task4.setStatus('aguardando');

const tasks = [task1, task2, task3, task4];

const processador = new EventEmitter();

processador.on('aguardar', (tasks) => {
    if (tasks && tasks.ids) {
        console.log(`Aguardando: Tarefas ${tasks.ids}.`);
    }
    else {
        console.log('Não há nenhuma tarefa aguardando!')
    }
})

processador.on('trabalhar', (task) => {
    if (task && task.id && task.iniciado) {
        console.log(`Trabalhando: Tarefa ${task.id} iniciada.`);
    }
    else if (task && task.id && !task.iniciado) {
        console.log(`Trabalhando: Tarefa ${task.id} está em andamento (número sorteado ${task.number}).`);
    }
    else {
        console.log('Não há nenhuma tarefa trabalhando!')
    }
})

processador.on('finalizar', (task) => {
    if (task && task.id) {
        console.log(`Finalizado: Tarefa ${task.id} concluída! (número sorteado ${task.number}).`);
    }
    else {
        console.log('Não há tarefas para serem finalizadas!')
    }
})

function atualizacaoStatus () {
    let n = Math.random().toFixed(2);

    let taskindex = tasks.findIndex(t => t.status == 'trabalhando')
    if (n > 0.7 && taskindex >= 0) {
        tasks[taskindex].setStatus('finalizada');
        processador.emit('finalizar', { id: tasks[taskindex].id, number: n});
        
        let prox = tasks.findIndex(t => t.status == 'aguardando');
        if (prox >= 0) {
            tasks[prox].setStatus('trabalhando');

            processador.emit('trabalhar', { id: tasks[prox].id, iniciado: true});

            let aguardando = tasks.filter(ta => ta.status == 'aguardando');
            let lista_aguardo = aguardando.map(t => t.id).join(', ');
            processador.emit('aguardar', { ids: `${lista_aguardo}` } );
        }
    }
    else if (taskindex < 0) {
        processador.emit('trabalhar', null);
    }
    else {
        processador.emit('trabalhar', { id: tasks[taskindex].id, iniciado: false, number: n});
        let aguardando = tasks.filter(ta => ta.status == 'aguardando');
        let lista_aguardo = aguardando.map(t => t.id).join(', ');
        processador.emit('aguardar', { ids: `${lista_aguardo}` } );
    }
}

console.log('Iniciando Processador...');
setInterval(atualizacaoStatus, 5000)