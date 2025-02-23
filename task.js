export function Tarefa(id, desc) {
    this.id = id;
    this.desc = desc;
    
    this.status;

    this.setStatus = function(status) {
        this.status = status;
    }

    this.getStatus = function() {
        return this.status;
    }

    this.getDesc = function() {
        return this.desc;
    }
}