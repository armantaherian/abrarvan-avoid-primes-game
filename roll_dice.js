function roll_dice() {
	roll_single_die("first_die")
	roll_single_die("second_die")
}

function roll_single_die(id){
    elem = $("#" + id + " > span") 
	current = elem.text()
	next = Math.floor(Math.random() * 7)
	do{
		next = Math.floor(Math.random() * 7)
	} while(next + "" == current)
	elem.text(next);
}
 
