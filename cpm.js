// estructura de la tarea
function Task() {
	this.id = '';
	this.task_length = 0;
	this.predecessor = [];
	this.earliest_start = 0;
	this.earliest_finish = 0;
	this.latest_start = 0;
	this.latest_finish = 0;
	this.total_float = 0;
	this.num_predecessors = 0;
	this.horizontal = 0;
	this.vertical = 0;
}
// definiciones de variables globales
var result = "", result2 = "",
	num_tasks = 0, max = 0, min = 0,
	task_data, max_horizontal = 0, critical_path = [],
	context = document.getElementById("cpm"),
	canvas = context.getContext("2d");
// algoritmo del método del camino crítico
function algorithm() {
	result = "";
	result2 = "";
	for (var j = 0; j < num_tasks; j++) {
		if (task_data[j].predecessor[0] == '0') {
			task_data[j].earliest_start = 0;
			task_data[j].earliest_finish = parseInt(task_data[j].task_length);
		} else {
			max = 0;
			for (var i = 0; i < task_data[j].num_predecessors; i++) {
				for (var k = 0; k < j; k++) {
					if (task_data[j].predecessor[i] == task_data[k].id) {
						if (max < task_data[k].earliest_finish) {
							max = task_data[k].earliest_finish;
						}
					}
				}
			}
			task_data[j].earliest_start = max;
			task_data[j].earliest_finish = parseInt(task_data[j].earliest_start)
				+ parseInt(task_data[j].task_length);
		}
	}
	max = 0;
	for (var j = 0; j < num_tasks; j++) {
		if (max < task_data[j].earliest_finish) {
			max = task_data[j].earliest_finish;
		}
	}
	for (var j = 0; j < num_tasks; j++) {
		task_data[j].latest_finish = -1;
	}
	var successor = 0;
	for (var i = (num_tasks - 1); i >= 0; i--) {
		for (var j = i + 1; j < num_tasks; j++) {
			for (var k = 0; k < task_data[j].num_predecessors; k++) {
				if (task_data[i].id == task_data[j].predecessor[k]) {
					successor++;
					if (task_data[i].latest_finish == -1) {
						task_data[i].latest_finish = task_data[j].latest_start;
						task_data[i].latest_start = task_data[i].latest_finish - task_data[i].task_length;
					} else {
						if (task_data[i].latest_finish > task_data[j].latest_start) {
							task_data[i].latest_finish = task_data[j].latest_start;
							task_data[i].latest_start = task_data[i].latest_finish - task_data[i].task_length;
						}
					}
				}
			}
		}
		if (successor == 0) {
			task_data[i].latest_finish = max;
			task_data[i].latest_start = task_data[i].latest_finish - task_data[i].task_length;
		} else successor = 0;
	}
	for (var i = 0; i < num_tasks; i++) {
		task_data[i].total_float = task_data[i].latest_finish - task_data[i].earliest_finish;
	}
	for (var i = 0; i < num_tasks; i++) {
		var max = 0;
		for (var j = 0; j < task_data[i].num_predecessors; j++) {
			for (var k = 0; k < i; k++) {
				if (task_data[i].predecessor[j] == task_data[k].id) {
					if (max <= task_data[k].horizontal) {
						max = task_data[k].horizontal + 1;
							}
						}
					}
				}
				task_data[i].horizontal = max;
				if (max > max_horizontal) max_horizontal = max;
			}
			// mostrar resultado
			for (var i = 0; i < num_tasks; i++) {
				var set = new Set(task_data[i].predecessor);
				var myArr = Array.from(set);
				myArr = myArr.sort();
				result = result + "<table><tr><td>ID de la Tarea</td><td><b>" + task_data[i].id
					+ "</b></tr><tr><td>Duración de la Tarea</td><td><b>" + task_data[i].task_length
					+ "</b></tr><tr><td>Predecesores</td><td><b>" + myArr.join(", ")
					+ "</b></tr><tr><td>Inicio Más Temprano</td><td><b>" + task_data[i].earliest_start
					+ "</b></tr><tr><td>Fin Más Temprano</td><td><b>" + task_data[i].earliest_finish
					+ "</b></tr><tr><td>Inicio Más Tardío</td><td><b>" + task_data[i].latest_start
					+ "</b></tr><tr><td>Fin Más Tardío</td><td><b>" + task_data[i].latest_finish
					+ "</b></tr><tr><td>Holgura Total</td><td><b>" + task_data[i].total_float
					+ "</td></tr></table>";
			}
			var a = 0;
			for (var i = 0; i < num_tasks; i++) {
				if (task_data[i].total_float == 0) {
					result2 = result2 + " " + task_data[i].id;
					critical_path[a] = task_data[i].id;
					a++;
				}
			}
			document.getElementById("result").innerHTML = '<div class="box">Resultados:<br><br>'
				+ result + '<hr><center><font size=4>Camino Crítico: <b>'
				+ result2 + '</b></font>.</center></div>';
			document.getElementById("canvas").className += 'box';
			canvas.canvas.height = num_tasks * 60 + 90;
			canvas.canvas.width = (1 + max_horizontal) * 90 + 90;
			drawTitle();
			for (var j = 0; j < max_horizontal + 1; j++) {
				var a = 0;
				for (var i = 0; i < num_tasks; i++) {
					if (task_data[i].horizontal == j) {
						drawTask(task_data[i].horizontal * 3 + 1, a * 3 + 1, task_data[i].id, i);
						task_data[i].vertical = a;
						a++;
					}
				}
			}
			for (var i = 1; i < num_tasks; i++) {
				for (var j = 0; j < task_data[i].num_predecessors; j++) {
					var o = 0, p = 0, x = 0;
					for (var k = 0; k < i; k++) {
						if (task_data[i].predecessor[j] == task_data[k].id) {
							o = task_data[k].horizontal;
							p = task_data[k].vertical;
						}
					}
					drawLine(task_data[i].horizontal * 3 + 2, task_data[i].vertical * 3 + 3, o * 3 + 4, p * 3 + 3 - 0.25, x);
				}
			}
			var o = 0, p = 0, r = 0, s = 0;
			for (var i = 0; i < critical_path.length; i++) {
				for (var j = 0; j < num_tasks; j++) {
					if (critical_path[i] == task_data[j].id) {
						o = task_data[j].horizontal;
						p = task_data[j].vertical;
					}
				}
				for (var j = 0; j < num_tasks; j++) {
					if (critical_path[i + 1] == task_data[j].id) {
						r = task_data[j].horizontal;
						s = task_data[j].vertical;
					}
				}
				if (i < critical_path.length - 1) {
					drawLine(r * 3 + 2, s * 3 + 3 + 0.25, o * 3 + 4, p * 3 + 3 + 0.25, 1);
				}
			}
			delete Task;
		}
		// ingresar datos
		function insert_data() {
			num_tasks = document.getElementById("num_tasks").value;
			if (num_tasks < 1) {
				alert("¡Debes ingresar al menos una tarea!");
				window.location.href = 'index.html';
			}
			task_data = [];
			for (var i = 0; i < num_tasks; i++) {
				task_data[i] = new Task();
			}
			document.getElementById("task_cards_container").style.display = 'block';
			document.getElementById("result").style.display = 'none';
			document.getElementById("canvas").style.display = 'none';
			var taskCards = document.getElementById("task_cards");
			taskCards.innerHTML = '';
			for (var i = 0; i < num_tasks; i++) {
				var card = document.createElement('div');
				card.className = 'task-card';
				card.innerHTML = `
					<h3>Tarea ${i + 1}</h3>
					<label>Duración: <input type="number" id="task_length_${i}" min="1" onchange="updateTaskTimes(${i})"></label><br>
					<label>Número de Predecesores: <input type="number" id="num_predecessors_${i}" min="0" onchange="updateTaskTimes(${i})"></label><br>
					<div id="predecessors_${i}"></div>
					<label>Inicio Más Temprano: <input type="number" id="earliest_start_${i}" min="0" readonly></label><br>
					<label>Fin Más Temprano: <input type="number" id="earliest_finish_${i}" min="0" readonly></label><br>
					<label>Inicio Más Tardío: <input type="number" id="latest_start_${i}" min="0" readonly></label><br>
					<label>Fin Más Tardío: <input type="number" id="latest_finish_${i}" min="0" readonly></label><br>
					<label>Holgura Total: <input type="number" id="total_float_${i}" min="0" readonly></label><br>
				`;
				taskCards.appendChild(card);

				document.getElementById(`task_length_${i}`).addEventListener('change', function() {
					updateTaskTimes(parseInt(this.id.split('_')[2]));
				});

				document.getElementById(`num_predecessors_${i}`).addEventListener('change', function() {
					var index = parseInt(this.id.split('_')[2]);
					var numPredecessors = parseInt(this.value);
					var predecessorsDiv = document.getElementById(`predecessors_${index}`);
					predecessorsDiv.innerHTML = '';
					for (var j = 0; j < numPredecessors; j++) {
						var predInput = document.createElement('input');
						predInput.type = 'number';
						predInput.min = '1';
						predInput.max = num_tasks.toString();
						predInput.placeholder = `Predecesor ${j + 1}`;
						predInput.addEventListener('change', function() {
							updateTaskTimes(index);
						});
						predecessorsDiv.appendChild(predInput);
					}
					updateTaskTimes(index);
				});
			}
		}
		// datos aleatorios
		function random() {
			num_tasks = document.getElementById("num_tasks").value;
			if (num_tasks < 1) {
				alert("¡Debes ingresar al menos una tarea!")
				window.location.href = 'index.html';
			}
			task_data = [];
			for (var i = 0; i < num_tasks; i++) {
				task_data[i] = new Task();
			}
			for (var i = 0; i < num_tasks; i++) {
				task_data[i].id = i + 1; // Use numeric IDs
				task_data[i].task_length = Math.floor(Math.random() * 50);
				if (i > 0) {
					task_data[i].num_predecessors = Math.floor(Math.random() * i) + 1;
				} else {
					task_data[i].num_predecessors = 0;
				}
				if (task_data[i].num_predecessors > 4) task_data[i].num_predecessors = 2;
				if (task_data[i].num_predecessors == 0) {
					task_data[i].predecessor[0] = '-';
				}
				var random_value = 0;
				for (var j = 0; j < task_data[i].num_predecessors; j++) {
					random_value = Math.floor(Math.random() * i);
					for (var k = 0; k < j; k++) {
						if (task_data[random_value].id == task_data[i].predecessor[k]) {
							random_value = Math.floor(Math.random() * i);
							k = 0;
						} else {
							k++;
						}
					}
					task_data[i].predecessor[j] = task_data[random_value].id;
				}
			}
			calculateEarliestTimes();
			calculateLatestTimes();
			calculateTotalFloat();
			algorithm();
			updateUI();
		}
		// dibujar gráfico
		function drawTitle() {
			canvas.beginPath();
			canvas.font = "14px Consolas";
			canvas.fillText("Gráfico:", 5, 15);
			canvas.stroke();
		}
		function drawTask(x, y, name, i) {
			x = x * 30 + 30;
			y = y * 30 + 30;
			canvas.beginPath();
			canvas.lineWidth = "2";
			canvas.strokeStyle = "black";
			canvas.rect(x, y, 60, 60);
			canvas.moveTo(x + 30, y);
			canvas.lineTo(x + 30, y + 60);
			canvas.moveTo(x, y + 30);
			canvas.lineTo(x + 60, y + 30);
			canvas.font = "14px Consolas";
			canvas.fillText(name, x, y - 5);
			canvas.fillText(task_data[i].earliest_start, x + 3, y + 20);
			canvas.fillText(task_data[i].earliest_finish, x + 33, y + 20);
			canvas.fillText(task_data[i].latest_start, x + 33, y + 50);
			canvas.fillText(task_data[i].latest_finish, x + 3, y + 50);
			canvas.stroke();
		}
		function drawLine(x, y, m, n, c) {
			canvas.beginPath();
			canvas.lineWidth = "5";
			if (c == 1) {
				var color = "rgba(0, 0, 255, 0.8)";

			} else {
				var color = "rgba(60, 188, 141, 0.5)"
			}
			x = x * 30;
			y = y * 30;
			m = m * 30;
			n = n * 30;
			canvas.strokeStyle = color;
			canvas.moveTo(x, y);
			canvas.lineTo(m, n);
			canvas.stroke();
		}

// Función para actualizar los tiempos de las tareas cuando cambian las dependencias
function updateTaskTimes(index) {
    const taskLength = parseInt(document.getElementById(`task_length_${index}`).value) || 0;
    const numPredecessors = parseInt(document.getElementById(`num_predecessors_${index}`).value) || 0;
    const predecessors = [];
    for (var j = 0; j < numPredecessors; j++) {
        const predValue = parseInt(document.getElementById(`predecessors_${index}`).children[j].value);
        if (predValue && predValue <= num_tasks) predecessors.push(predValue);
    }

    task_data[index].id = index + 1;
    task_data[index].task_length = taskLength;
    task_data[index].num_predecessors = predecessors.length;
    task_data[index].predecessor = predecessors;

    calculateAllTimes();
}

// Función para calcular los tiempos de inicio y fin más tempranos basados en las dependencias
function calculateEarliestTimes() {
    for (var i = 0; i < num_tasks; i++) {
        if (task_data[i].num_predecessors === 0) {
            task_data[i].earliest_start = 0;
        } else {
            let maxFinish = 0;
            for (var j = 0; j < task_data[i].num_predecessors; j++) {
                const predId = task_data[i].predecessor[j];
                const predTask = task_data[predId - 1];
                if (predTask && predTask.earliest_finish > maxFinish) {
                    maxFinish = predTask.earliest_finish;
                }
            }
            task_data[i].earliest_start = maxFinish;
        }
        task_data[i].earliest_finish = task_data[i].earliest_start + task_data[i].task_length;
    }
}

// Función para calcular los tiempos de inicio y fin más tardíos basados en las dependencias
function calculateLatestTimes() {
    let maxFinish = Math.max(...task_data.map(task => task.earliest_finish));
    for (var i = num_tasks - 1; i >= 0; i--) {
        if (i === num_tasks - 1 || !hasSuccessors(task_data[i].id)) {
            task_data[i].latest_finish = maxFinish;
        } else {
            let minStart = Infinity;
            for (var j = 0; j < num_tasks; j++) {
                if (task_data[j].predecessor.includes(task_data[i].id)) {
                    if (task_data[j].latest_start < minStart) {
                        minStart = task_data[j].latest_start;
                    }
                }
            }
            task_data[i].latest_finish = minStart;
        }
        task_data[i].latest_start = task_data[i].latest_finish - task_data[i].task_length;
    }
}

// Función auxiliar para verificar si una tarea tiene sucesores
function hasSuccessors(taskId) {
    return task_data.some(task => task.predecessor.includes(taskId));
}

// Función para calcular la holgura total para cada tarea
function calculateTotalFloat() {
    for (var i = 0; i < num_tasks; i++) {
        task_data[i].total_float = task_data[i].latest_start - task_data[i].earliest_start;
    }
}

// Función para actualizar la interfaz de usuario con los últimos tiempos de las tareas
function updateUI() {
    for (var i = 0; i < num_tasks; i++) {
        document.getElementById(`earliest_start_${i}`).value = task_data[i].earliest_start;
        document.getElementById(`earliest_finish_${i}`).value = task_data[i].earliest_finish;
        document.getElementById(`latest_start_${i}`).value = task_data[i].latest_start;
        document.getElementById(`latest_finish_${i}`).value = task_data[i].latest_finish;
        document.getElementById(`total_float_${i}`).value = task_data[i].total_float;
    }
}

// Función para calcular todos los tiempos y actualizar la interfaz de usuario
function calculateAllTimes() {
    calculateEarliestTimes();
    calculateLatestTimes();
    calculateTotalFloat();
    updateUI();
}

// Función para enviar los datos de las tareas y generar resultados
function submitTaskData() {
    // Asegurar que todos los datos de las tareas estén actualizados
    for (var i = 0; i < num_tasks; i++) {
        updateTaskTimes(i);
    }

    // Calcular todos los tiempos una última vez
    calculateAllTimes();

    // Generar resultados
    algorithm();

    // Ocultar las tarjetas de entrada de tareas
    document.getElementById("task_cards_container").style.display = 'none';

    // Mostrar los resultados y el canvas
    document.getElementById("result").style.display = 'block';
    document.getElementById("canvas").style.display = 'block';
}